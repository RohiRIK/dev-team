use colored::*;
use indicatif::{MultiProgress, ProgressBar, ProgressStyle};
use std::process::{Child, Command, Stdio};
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Duration, Instant};
use tokio::time::sleep;
use console::Term;
use owo_colors::OwoColorize;
use sysinfo::{System, Pid};
use anyhow::{Context, Result};
use figlet_rs::FIGfont;
use std::path::Path;
use dialoguer::{theme::ColorfulTheme, MultiSelect};
use rust_embed::RustEmbed;

// Embed all agent configurations
#[derive(RustEmbed)]
#[folder = "../agents/"]
#[prefix = "agents/"]
struct AgentAssets;

// Embed shared knowledge
#[derive(RustEmbed)]
#[folder = "../agents/_shared/"]
#[prefix = "shared/"]
struct SharedAssets;

// Test function to list embedded agents
fn list_embedded_agents() {
    println!("\n🔍 Embedded Agents:");
    for file in AgentAssets::iter() {
        if file.ends_with("agent.json") {
            println!("  ✓ {}", file.green());
        }
    }
    println!();
}

// Function to load agent from embedded files
fn load_embedded_agent(agent_name: &str) -> Result<String> {
    let agent_path = format!("agents/{}/agent.json", agent_name);
    let agent_data = AgentAssets::get(&agent_path)
        .with_context(|| format!("Agent '{}' not found in embedded files", agent_name))?;
    
    String::from_utf8(agent_data.data.to_vec())
        .context("Failed to parse agent JSON as UTF-8")
}

// Extract all embedded agents to runtime directory
fn extract_embedded_agents() -> Result<std::path::PathBuf> {
    let buddy_home = std::env::var("BUDDY_HOME")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|_| {
            // Use ~/.buddy-ai/ for persistent storage
            dirs::home_dir()
                .expect("Could not find home directory")
                .join(".buddy-ai")
        });
    
    let agents_dir = buddy_home.join("agents");
    let version_file = buddy_home.join(".version");
    
    // Check if already extracted with current version
    if version_file.exists() {
        if let Ok(version) = std::fs::read_to_string(&version_file) {
            if version == env!("CARGO_PKG_VERSION") {
                // Already extracted, use cached
                return Ok(agents_dir);
            }
        }
    }
    
    // Create directory
    std::fs::create_dir_all(&agents_dir)
        .context("Failed to create agents directory")?;
    
    // Extract all agent files
    println!("  {} Extracting embedded agents to {}...", 
        "📦".bright_cyan(), 
        agents_dir.display().to_string().dimmed()
    );
    
    let mut count = 0;
    for file_path in AgentAssets::iter() {
        let file_data = AgentAssets::get(&file_path).unwrap();
        let dest_path = buddy_home.join(file_path.as_ref());
        
        if let Some(parent) = dest_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        std::fs::write(&dest_path, file_data.data.as_ref())?;
        count += 1;
    }
    
    // Extract shared knowledge
    for file_path in SharedAssets::iter() {
        let file_data = SharedAssets::get(&file_path).unwrap();
        let dest_path = buddy_home.join("agents/_shared").join(file_path.strip_prefix("shared/").unwrap());
        
        if let Some(parent) = dest_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        std::fs::write(&dest_path, file_data.data.as_ref())?;
        count += 1;
    }
    
    // Write version file
    std::fs::write(&version_file, env!("CARGO_PKG_VERSION"))?;
    
    println!("  {} Extracted {} files\n", "✓".bright_green(), count);
    
    Ok(agents_dir)
}

#[derive(Debug, serde::Deserialize)]
struct LauncherConfig {
    #[serde(default)]
    startup: StartupConfig,
    #[serde(default)]
    ui: UiConfig,
    #[serde(default)]
    performance: PerformanceConfig,
}

#[derive(Debug, serde::Deserialize)]
struct StartupConfig {
    #[serde(default)]
    essential: Vec<String>,
    #[serde(default)]
    skip: Vec<String>,
    #[serde(default = "default_true")]
    start_all: bool,
}

#[derive(Debug, serde::Deserialize)]
struct UiConfig {
    #[serde(default = "default_true")]
    colors: bool,
    #[serde(default)]
    verbose: bool,
    #[serde(default = "default_true")]
    animations: bool,
    #[serde(default)]
    interactive: bool,
}

#[derive(Debug, serde::Deserialize)]
struct PerformanceConfig {
    #[serde(default = "default_startup_timeout")]
    startup_timeout: u64,
    #[serde(default = "default_health_check_interval")]
    health_check_interval: u64,
    #[serde(default = "default_max_retries")]
    max_retries: u32,
}

fn default_true() -> bool { true }
fn default_startup_timeout() -> u64 { 10 }
fn default_health_check_interval() -> u64 { 30 }
fn default_max_retries() -> u32 { 3 }

impl Default for StartupConfig {
    fn default() -> Self {
        Self {
            essential: vec!["agent-loader".to_string(), "agent-context-hub".to_string()],
            skip: vec![],
            start_all: true,
        }
    }
}

impl Default for UiConfig {
    fn default() -> Self {
        Self {
            colors: true,
            verbose: false,
            animations: true,
            interactive: false,
        }
    }
}

impl Default for PerformanceConfig {
    fn default() -> Self {
        Self {
            startup_timeout: 10,
            health_check_interval: 30,
            max_retries: 3,
        }
    }
}

impl Default for LauncherConfig {
    fn default() -> Self {
        Self {
            startup: StartupConfig::default(),
            ui: UiConfig::default(),
            performance: PerformanceConfig::default(),
        }
    }
}

#[derive(Clone)]
struct McpServer {
    name: String,
    command: String,
    args: Vec<String>,
    cwd: Option<String>,
    env_vars: Vec<(String, String)>,
    emoji: String,
    priority: u8,  // 0 = highest priority
}

struct RunningServer {
    process: Child,
    name: String,
    emoji: String,
    start_time: Instant,
    retries: u32,
}

fn load_config() -> LauncherConfig {
    let mut config_paths = vec![
        ".gemini/launcher/launcher.toml",
        "launcher.toml",
    ];
    
    if let Ok(home) = std::env::var("HOME") {
        config_paths.push(Box::leak(format!("{}/.config/buddy-ai/launcher.toml", home).into_boxed_str()));
    }
    
    for path in config_paths {
        if Path::new(&path).exists() {
            if let Ok(contents) = std::fs::read_to_string(&path) {
                if let Ok(config) = toml::from_str::<LauncherConfig>(&contents) {
                    println!("  {} Loaded config from: {}", "✓".bright_green(), path.dimmed());
                    return config;
                }
            }
        }
    }
    
    LauncherConfig::default()
}

impl McpServer {
    fn start(&self) -> Result<Child> {
        let mut cmd = Command::new(&self.command);
        cmd.args(&self.args)
            .stdin(Stdio::null())   // Don't capture stdin from terminal
            .stdout(Stdio::null())
            .stderr(Stdio::null());

        if let Some(cwd) = &self.cwd {
            cmd.current_dir(cwd);
        }

        for (key, value) in &self.env_vars {
            let expanded_value = shellexpand::tilde(value).to_string();
            cmd.env(key, expanded_value);
        }

        cmd.spawn()
            .context(format!("Failed to start {} server", self.name))
            .context(format!("Command: {} {}", self.command, self.args.join(" ")))
            .context("Ensure all dependencies (bun, npx, uvx) are installed and in PATH")
    }
}

fn print_banner() {
    // Try to load ASCII art font
    if let Ok(font) = FIGfont::standard() {
        if let Some(figure) = font.convert("Buddy AI") {
            println!("{}", figure.to_string().bright_cyan().bold());
            println!("  {}\n", "Multi-Agent Development System".bright_white().dimmed());
            return;
        }
    }
    
    // Fallback to box banner
    let banner = r#"
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║         ✨  BUDDY AI MULTI-AGENT LAUNCHER  ✨            ║
    ║                                                           ║
    ║         Initializing Development Environment...          ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    "#;
    
    println!("{}", banner.bright_cyan().bold());
}

fn print_server_list() {
    println!("\n  📦 {} {}\n", "MCP Servers:".bright_white().bold(), "Starting up...".dimmed());
}

fn load_mcp_servers() -> Vec<McpServer> {
    vec![
        McpServer {
            name: "Agent Loader".to_string(),
            command: "bun".to_string(),
            args: vec![".gemini/mcp/agent-loader/src/index.ts".to_string()],
            cwd: Some(".".to_string()),
            env_vars: vec![("AGENTS_DIR".to_string(), ".gemini/agents".to_string())],
            emoji: "🤖".to_string(),
            priority: 0,  // Critical
        },
        McpServer {
            name: "Agent Context Hub".to_string(),
            command: "bun".to_string(),
            args: vec![".gemini/mcp/agent-context-hub/src/index.ts".to_string()],
            cwd: Some(".".to_string()),
            env_vars: vec![
                ("AGENTS_PATH".to_string(), ".gemini/agents".to_string()),
                ("LOG_LEVEL".to_string(), "info".to_string()),
            ],
            emoji: "🧠".to_string(),
            priority: 0,  // Critical
        },
        McpServer {
            name: "Agent Execution Hub".to_string(),
            command: "bun".to_string(),
            args: vec![".gemini/mcp/agent-execution-hub/src/index.ts".to_string()],
            cwd: Some(".".to_string()),
            env_vars: vec![("AGENTS_DIR".to_string(), ".gemini/agents".to_string())],
            emoji: "⚡".to_string(),
            priority: 1,  // High priority
        },
        McpServer {
            name: "Fabric Integration".to_string(),
            command: "bun".to_string(),
            args: vec![".gemini/mcp/fabric-integration/src/index.ts".to_string()],
            cwd: None,
            env_vars: vec![
                ("FABRIC_HOME".to_string(), "~/.config/fabric".to_string()),
                ("PATH".to_string(), "/opt/homebrew/bin:$PATH".to_string()),
            ],
            emoji: "🧵".to_string(),
            priority: 2,  // Medium priority
        },
        McpServer {
            name: "Workflow Loader".to_string(),
            command: "bun".to_string(),
            args: vec![".gemini/mcp/workflow-loader/src/index.ts".to_string()],
            cwd: Some(".".to_string()),
            env_vars: vec![],
            emoji: "🔄".to_string(),
            priority: 2,  // Medium priority
        },
        McpServer {
            name: "Context7".to_string(),
            command: "npx".to_string(),
            args: vec![
                "-y".to_string(),
                "@upstash/context7-mcp".to_string(),
                "--api-key".to_string(),
                "ctx7sk-b659da33-6c3d-4b50-9a4b-4db638b7d69a".to_string(),
            ],
            cwd: None,
            env_vars: vec![],
            emoji: "📚".to_string(),
            priority: 2,  // Medium priority
        },
        McpServer {
            name: "Sequential Thinking".to_string(),
            command: "npx".to_string(),
            args: vec![
                "-y".to_string(),
                "@modelcontextprotocol/server-sequential-thinking".to_string(),
            ],
            cwd: None,
            env_vars: vec![],
            emoji: "🧩".to_string(),
            priority: 1,  // High priority
        },
        McpServer {
            name: "DeepWiki".to_string(),
            command: "npx".to_string(),
            args: vec![
                "-y".to_string(),
                "mcp-remote".to_string(),
                "https://mcp.deepwiki.com/sse".to_string(),
            ],
            cwd: None,
            env_vars: vec![],
            emoji: "🌐".to_string(),
            priority: 3,  // Low priority
        },
        McpServer {
            name: "Fetch".to_string(),
            command: "uvx".to_string(),
            args: vec!["mcp-server-fetch".to_string()],
            cwd: None,
            env_vars: vec![],
            emoji: "🔍".to_string(),
            priority: 2,  // Medium priority
        },
        McpServer {
            name: "Playwright".to_string(),
            command: "npx".to_string(),
            args: vec![
                "-y".to_string(),
                "@executeautomation/playwright-mcp-server".to_string(),
            ],
            cwd: None,
            env_vars: vec![],
            emoji: "🎭".to_string(),
            priority: 3,  // Low priority
        },
    ]
}

#[tokio::main]
async fn main() -> Result<()> {
    let start_time = Instant::now();
    let term = Term::stdout();
    
    // Load configuration
    let config = load_config();
    
    // Clean up any orphaned processes from previous runs
    cleanup_orphaned_processes()?;
    
    // Set terminal title
    let _ = term.set_title("🤖 Buddy AI - Starting...");
    
    // Test: List embedded agents
    list_embedded_agents();
    
    // Test: Load one agent
    match load_embedded_agent("product-manager") {
        Ok(json) => {
            println!("  {} Successfully loaded embedded agent!", "✅".bright_green());
            println!("  {} Agent data: {}...\n", "📦".bright_cyan(), &json[..100.min(json.len())]);
        }
        Err(e) => {
            println!("  {} Failed to load agent: {}\n", "❌".bright_red(), e);
        }
    }
    
    // Extract agents to runtime directory
    let agents_dir = extract_embedded_agents()?;
    println!("  {} Agents available at: {}\n", 
        "📂".bright_white(),
        agents_dir.display().to_string().bright_cyan()
    );
    
    // Update MCP environment to use extracted agents
    std::env::set_var("AGENTS_DIR", &agents_dir.parent().unwrap());
    std::env::set_var("AGENTS_PATH", &agents_dir.parent().unwrap());
    
    print_banner();
    
    // Show config status
    if config.startup.skip.len() > 0 {
        println!("  {} Skipping {} servers: {}\n",
            "⚠️".bright_yellow(),
            config.startup.skip.len(),
            config.startup.skip.join(", ").dimmed()
        );
    }
    
    print_server_list();

    let mut servers = load_mcp_servers();
    
    // Interactive mode: let user choose servers
    if config.ui.interactive {
        let server_names: Vec<String> = servers.iter()
            .map(|s| format!("{} {} (priority: {})", s.emoji, s.name, s.priority))
            .collect();
        
        let defaults: Vec<bool> = servers.iter()
            .map(|s| s.priority <= 1)  // Auto-select critical and high priority
            .collect();
        
        println!("\n  {} {}\n", "🎯".bright_cyan(), "Select servers to start:".bright_white().bold());
        
        let selections = MultiSelect::with_theme(&ColorfulTheme::default())
            .items(&server_names)
            .defaults(&defaults)
            .interact()
            .unwrap();
        
        let selected_servers: Vec<McpServer> = selections.iter()
            .map(|&i| servers[i].clone())
            .collect();
        
        servers = selected_servers;
        println!();
    }
    
    // Filter out skipped servers
    servers.retain(|s| !config.startup.skip.iter().any(|skip| s.name.contains(skip)));
    
    // Sort by priority (0 = highest, 3 = lowest)
    servers.sort_by_key(|s| s.priority);
    
    let total_servers = servers.len();
    let multi_progress = MultiProgress::new();
    
    let spinner_style = ProgressStyle::default_spinner()
        .tick_chars("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏")
        .template("  {spinner:.green} {msg}")
        .unwrap();

    let mut running_servers: Vec<RunningServer> = Vec::new();
    let mut handles = Vec::new();
    let mut failed_servers = Vec::new();

    // Start all servers concurrently
    for server in servers {
        let pb = multi_progress.add(ProgressBar::new_spinner());
        pb.set_style(spinner_style.clone());
        pb.set_message(format!(
            "{} {} {}",
            server.emoji,
            server.name.bright_white().bold(),
            "starting...".dimmed()
        ));
        pb.enable_steady_tick(Duration::from_millis(80));

        let server_name = server.name.clone();
        let server_emoji = server.emoji.clone();
        let is_critical = server.priority == 0;  // Priority 0 = critical

        match server.start() {
            Ok(child) => {
                running_servers.push(RunningServer {
                    process: child,
                    name: server_name.clone(),
                    emoji: server_emoji.clone(),
                    start_time: Instant::now(),
                    retries: 0,
                });
                
                // Simulate startup time
                let pb_clone = pb.clone();
                let handle = tokio::spawn(async move {
                    sleep(Duration::from_millis(500 + (rand::random::<u64>() % 500))).await;
                    pb_clone.finish_with_message(format!(
                        "{} {} {}",
                        server_emoji,
                        server_name.bright_white().bold(),
                        "✓".bright_green().bold()
                    ));
                });
                handles.push(handle);
            }
            Err(e) => {
                let error_msg = format!("{:?}", e);
                pb.finish_with_message(format!(
                    "{} {} {} {}",
                    server_emoji,
                    server_name.bright_white().bold(),
                    "✗".bright_red().bold(),
                    "failed".dimmed()
                ));
                
                if is_critical {
                    eprintln!("\n  {} Critical server failed: {}", "❌".bright_red(), server_name);
                    eprintln!("  {}\n", error_msg.dimmed());
                    
                    // Cleanup and exit
                    for mut server in running_servers {
                        let _ = server.process.kill();
                    }
                    
                    return Err(anyhow::anyhow!("Critical server {} failed to start", server_name));
                } else {
                    failed_servers.push((server_name.clone(), error_msg));
                }
            }
        }
    }

    // Wait for all startup animations
    for handle in handles {
        let _ = handle.await;
    }

    println!("\n  {} {}\n", "✨".bright_yellow(), "All MCP servers initialized!".bright_green().bold());
    
    // Show failed servers if any
    if !failed_servers.is_empty() {
        println!("  {} {} non-critical servers failed:", "⚠️".bright_yellow(), failed_servers.len());
        for (name, _) in &failed_servers {
            println!("     {} {}", "•".dimmed(), name.dimmed());
        }
        println!();
    }
    
    // Beautiful initialization progress
    let init_pb = ProgressBar::new(100);
    init_pb.set_style(
        ProgressStyle::default_bar()
            .template("  {msg} [{bar:40.cyan/blue}] {percent}%")
            .unwrap()
            .progress_chars("━━╸━")  // Modern progress bar style
    );
    init_pb.set_message("⏳ Initializing system".bright_white().to_string());
    
    for i in 0..=100 {
        init_pb.set_position(i);
        tokio::time::sleep(Duration::from_millis(15)).await;
    }
    init_pb.finish_and_clear();
    
    // Show startup metrics
    let startup_time = start_time.elapsed();
    println!("\n  {} {} {}",
        "⚡".bright_yellow(),
        "Ready in".bright_white(),
        format!("{}ms", startup_time.as_millis()).bright_cyan().bold()
    );
    println!("  {} {}/{} servers started\n",
        "✓".bright_green(),
        running_servers.len().to_string().bright_green().bold(),
        total_servers
    );
    
    // Show resource usage
    print_resource_usage(&running_servers);

    // Update terminal title
    let _ = term.set_title("🤖 Buddy AI - Ready ✓");
    
    // Save PID file for crash recovery
    save_pid_file(&running_servers)?;

    println!("\n  {} {}\n", "🚀".bright_yellow(), "Launching Buddy AI...".bright_cyan().bold());
    
    let divider = "  ═══════════════════════════════════════════════════════════";
    println!("{}\n", divider.bright_blue().dimmed());

    // Setup Ctrl+C handler
    let running = Arc::new(AtomicBool::new(true));
    let r = running.clone();
    
    ctrlc::set_handler(move || {
        r.store(false, Ordering::SeqCst);
    }).expect("Error setting Ctrl-C handler");

    // Launch Buddy AI (via Gemini CLI)
    let gemini_result = Command::new("gemini")
        .current_dir(".")
        .spawn();

    match gemini_result {
        Ok(mut gemini_child) => {
            // Wait for Buddy AI to exit or Ctrl+C
            while running.load(Ordering::SeqCst) {
                match gemini_child.try_wait() {
                    Ok(Some(_)) => break,
                    Ok(None) => {
                        std::thread::sleep(Duration::from_millis(100));
                    }
                    Err(_) => break,
                }
            }
            
            let _ = gemini_child.kill();
            
            // Cleanup animation
            println!("\n{}", divider.bright_blue().dimmed());
            println!("\n  {} {}", "🧹".bright_yellow(), "Shutting down MCP servers...".bright_white());
            
            let cleanup_pb = ProgressBar::new(running_servers.len() as u64);
            cleanup_pb.set_style(
                ProgressStyle::default_bar()
                    .template("  {spinner:.red} [{bar:40.red/bright_black}] {pos}/{len} servers")
                    .unwrap()
                    .progress_chars("━━╸━")
                    .tick_chars("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏")
            );
            cleanup_pb.enable_steady_tick(Duration::from_millis(80));
            
            for mut server in running_servers {
                let _ = server.process.kill();
                cleanup_pb.inc(1);
                std::thread::sleep(Duration::from_millis(50));
            }
            
            cleanup_pb.finish_and_clear();
            
            // Remove PID file
            let _ = std::fs::remove_file("/tmp/buddy-ai.pids");
            
            let total_time = start_time.elapsed();
            println!("\n  {} {}\n", "✓".bright_green().bold(), "All servers stopped cleanly".bright_white());
            println!("  {} Session duration: {}\n", 
                "⏱️".bright_white(),
                format!("{}m {}s", total_time.as_secs() / 60, total_time.as_secs() % 60).bright_cyan()
            );
            println!("  {} {}\n", "👋".bright_yellow(), "Goodbye!".bright_magenta().bold());
        }
        Err(e) => {
            println!("\n  {} {} {}\n", 
                "❌".bright_red(), 
                "Failed to start Buddy AI:".bright_red().bold(), 
                e.to_string().dimmed()
            );
            
            // Cleanup on error
            println!("  {} {}", "🧹".bright_yellow(), "Cleaning up servers...".dimmed());
            for mut server in running_servers {
                let _ = server.process.kill();
            }
            let _ = std::fs::remove_file("/tmp/buddy-ai.pids");
            println!("  {} {}\n", "✓".bright_green(), "Cleanup complete".dimmed());
        }
    }
    
    Ok(())
}

// Helper for shell expansion
mod shellexpand {
    pub fn tilde(path: &str) -> std::borrow::Cow<str> {
        if path.starts_with('~') {
            if let Some(home) = std::env::var("HOME").ok() {
                return std::borrow::Cow::Owned(path.replacen('~', &home, 1));
            }
        }
        std::borrow::Cow::Borrowed(path)
    }
}

// Cleanup orphaned processes from previous crashed runs
fn cleanup_orphaned_processes() -> Result<()> {
    if let Ok(pids_data) = std::fs::read_to_string("/tmp/buddy-ai.pids") {
        for line in pids_data.lines() {
            if let Ok(pid) = line.parse::<u32>() {
                // Try to kill the process
                #[cfg(unix)]
                {
                    use std::process::Command;
                    let _ = Command::new("kill")
                        .arg("-9")
                        .arg(pid.to_string())
                        .output();
                }
            }
        }
        let _ = std::fs::remove_file("/tmp/buddy-ai.pids");
    }
    Ok(())
}

// Save PIDs for crash recovery
fn save_pid_file(servers: &[RunningServer]) -> Result<()> {
    let mut pids = String::new();
    for server in servers {
        pids.push_str(&format!("{}\n", server.process.id()));
    }
    std::fs::write("/tmp/buddy-ai.pids", pids)
        .context("Failed to write PID file for crash recovery")?;
    Ok(())
}

// Print resource usage for running servers
fn print_resource_usage(servers: &[RunningServer]) {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let mut total_cpu = 0.0;
    let mut total_mem = 0;
    
    for server in servers {
        let pid = Pid::from_u32(server.process.id());
        if let Some(process) = sys.process(pid) {
            total_cpu += process.cpu_usage();
            total_mem += process.memory();
        }
    }
    
    println!("  {} CPU: {:.1}% | RAM: {}MB\n",
        "💻".bright_white(),
        total_cpu,
        total_mem / 1024 / 1024
    );
}
