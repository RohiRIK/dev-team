# 🎯 Portable Buddy AI - Implementation Plan

## Goal
Create a **standalone, portable Buddy AI** that doesn't require `.gemini/` folder structure. Everything is embedded or bundled with the binary.

## 📋 Research Findings - Best Practices

### Option 1: **`rust-embed` Crate** (⭐ Recommended)
- **What**: Embeds static files directly into the binary at compile time
- **Pros**: 
  - Single binary, no external files needed
  - Fast access (files are in memory)
  - Cross-platform compatible
  - Zero runtime dependencies
- **Cons**: 
  - Increases binary size
  - Files can't be updated without recompiling

**Example Usage:**
```rust
use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = ".gemini/agents/"]
struct Agents;

// Access files at runtime
let agent_json = Agents::get("product-manager/agent.json").unwrap();
```

### Option 2: **`include_str!` / `include_bytes!` Macros** (Simple)
- **What**: Built-in Rust macros that embed files at compile time
- **Pros**:
  - No dependencies
  - Simple and straightforward
  - Perfect for small files
- **Cons**:
  - Manual for each file
  - Not great for many files

**Example:**
```rust
const PRODUCT_MANAGER: &str = include_str!("../../agents/product-manager/agent.json");
const KNOWLEDGE_BASE: &str = include_str!("../../agents/_shared/knowledge/research.md");
```

### Option 3: **Self-Extracting Archive** (Hybrid)
- **What**: Bundle files with binary, extract on first run
- **Pros**:
  - Can update knowledge without recompiling
  - Smaller initial download
- **Cons**:
  - Needs write permissions
  - First-run extraction step
  - More complex

### Option 4: **SQLite Database** (Dynamic)
- **What**: Embed rusqlite + agents.db file
- **Pros**:
  - Query agents dynamically
  - Can be updated
  - Good for large knowledge bases
- **Cons**:
  - More complex
  - Requires SQLite dependency

## 🎯 Recommended Approach: **rust-embed + embedded MCP**

### Architecture
```
buddy (single binary)
├── Embedded Agents (rust-embed)
│   ├── product-manager/
│   ├── github-manager/
│   ├── _shared/knowledge/
│   └── ... (29+ agents)
├── Embedded MCP Servers (include TypeScript/Bun)
│   ├── agent-loader
│   ├── agent-context-hub
│   └── agent-execution-hub
└── Launcher Logic (current code)
```

## 📦 Implementation Steps

### Phase 1: Embed Agent Configurations (Week 1)
```toml
# Add to Cargo.toml
[dependencies]
rust-embed = "8.5"
serde = "1.0"
serde_json = "1.0"
```

```rust
// In main.rs
#[derive(RustEmbed)]
#[folder = ".gemini/agents/"]
struct AgentAssets;

#[derive(RustEmbed)]
#[folder = ".gemini/agents/_shared/knowledge/"]
struct KnowledgeAssets;

// At runtime, extract to temp dir or serve from memory
fn load_agent(name: &str) -> Result<Agent> {
    let config_path = format!("{}/agent.json", name);
    let config_data = AgentAssets::get(&config_path)
        .context("Agent not found")?;
    
    serde_json::from_slice(&config_data.data)
        .context("Failed to parse agent config")
}
```

### Phase 2: Bundle MCP Servers (Week 2)

**Option A: Embed Bun Binary + TypeScript Source**
```rust
#[derive(RustEmbed)]
#[folder = ".gemini/mcp/"]
struct McpServers;

// At startup, extract to temp dir
fn extract_mcp_servers() -> Result<PathBuf> {
    let temp_dir = std::env::temp_dir().join("buddy-ai");
    // Extract all MCP TypeScript files
    // Keep Bun in binary or use system Bun
}
```

**Option B: Compile MCP to Standalone Executables**
```bash
# Use Bun to compile MCPs to binaries
bun build --compile src/index.ts --outfile agent-loader
```

Then embed the binaries:
```rust
const AGENT_LOADER_BIN: &[u8] = include_bytes!("../../mcp/agent-loader-binary");
const CONTEXT_HUB_BIN: &[u8] = include_bytes!("../../mcp/agent-context-hub-binary");
```

### Phase 3: Smart Extraction (Week 3)
```rust
fn ensure_runtime_files() -> Result<PathBuf> {
    let buddy_home = if let Ok(home) = std::env::var("BUDDY_HOME") {
        PathBuf::from(home)
    } else {
        dirs::home_dir()
            .unwrap()
            .join(".buddy-ai")
    };
    
    // Check if already extracted (version check)
    if buddy_home.join(".version").exists() {
        let version = std::fs::read_to_string(buddy_home.join(".version"))?;
        if version == env!("CARGO_PKG_VERSION") {
            return Ok(buddy_home); // Already extracted, use cached
        }
    }
    
    // Extract agents and MCPs
    extract_embedded_files(&buddy_home)?;
    
    Ok(buddy_home)
}
```

### Phase 4: Configuration (Week 4)
```toml
# ~/.buddy-ai/config.toml (user overrides)
[agents]
custom_path = "/path/to/extra/agents"  # Optional: load additional agents

[mcp]
use_system_bun = true  # Use system Bun instead of embedded

[launcher]
skip_servers = ["deepwiki"]
```

## 🚀 Final Distribution

### Single Binary Distribution
```bash
# macOS
./buddy

# Linux
./buddy

# Windows
buddy.exe
```

### With Optional Data Directory
```
buddy                    # 10-15MB binary (all embedded)
~/.buddy-ai/            # Extracted at first run
  ├── .version
  ├── agents/           # Extracted from embedded
  ├── mcp/              # Extracted from embedded
  └── config.toml       # User customizations
```

### Installation Methods

**1. Homebrew (macOS/Linux)**
```ruby
class Buddy < Formula
  desc "Portable AI assistant with 29+ specialized agents"
  homepage "https://github.com/yourusername/buddy-ai"
  url "https://github.com/yourusername/buddy-ai/releases/download/v1.0.0/buddy-darwin-arm64.tar.gz"
  sha256 "..."
  
  def install
    bin.install "buddy"
  end
end
```

**2. Direct Download**
```bash
curl -L https://github.com/user/buddy-ai/releases/latest/download/buddy-$(uname -s)-$(uname -m) -o buddy
chmod +x buddy
./buddy
```

**3. Cargo Install**
```bash
cargo install buddy-ai
buddy
```

## 📊 Size Estimates

```
Binary Components:
- Rust launcher:          2MB
- Embedded agents:        5MB (JSON configs + knowledge files)
- Embedded MCPs:          3-5MB (TypeScript or compiled binaries)
- Dependencies:           3MB (figlet, serde, etc.)
────────────────────────────
Total Binary Size:        13-15MB

First Run Extraction:
- ~/.buddy-ai/:           8MB (agents + MCP servers)

Total Disk Space:         21-23MB
```

## ✅ Benefits of Portable Approach

1. **✅ Single Download** - One binary, no setup
2. **✅ No Dependencies** - Doesn't require `.gemini/` folder
3. **✅ Version Control** - Agents versioned with binary
4. **✅ Offline Ready** - All knowledge embedded
5. **✅ Easy Distribution** - Share one file
6. **✅ Cross-Platform** - Same approach for all OS
7. **✅ Fast Startup** - No file scanning needed
8. **✅ Secure** - Embedded files can't be tampered with

## 🎯 Success Criteria

- [ ] Single `buddy` binary runs without `.gemini/` folder
- [ ] All 29+ agents accessible from embedded files
- [ ] MCPs start successfully from embedded/extracted files
- [ ] Binary size < 20MB
- [ ] First-run extraction < 2 seconds
- [ ] Subsequent runs < 3 seconds startup
- [ ] Cross-platform (macOS, Linux, Windows)
- [ ] User can override with custom agents
- [ ] Easy update mechanism

## 📝 Next Steps

1. **Prototype**: Add rust-embed for one agent
2. **Test**: Verify agent loads from embedded files
3. **Expand**: Embed all agents
4. **MCP**: Decide on embedding strategy (bundle vs compile)
5. **Polish**: Add extraction, caching, version checks
6. **Distribute**: Create releases for all platforms

---

**Target Release**: v2.0.0 - "Portable Edition"
**Estimated Time**: 3-4 weeks
**Team Size**: 1-2 developers
