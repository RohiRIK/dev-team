# 🦀 Buddy AI Launcher

**Beautiful, fast, and reliable terminal launcher for Buddy AI with automatic MCP server management.**

Built with Rust for maximum performance and beautiful terminal UI.

## ✨ Features

- 🚀 **Lightning Fast** - Compiled Rust binary, instant startup
- 🎨 **Beautiful UI** - Gorgeous progress bars, spinners, and colors
- 🔄 **Concurrent Startup** - All MCP servers start in parallel
- 🧹 **Auto Cleanup** - Press Ctrl+C to cleanly shutdown everything
- 📊 **Progress Tracking** - Visual feedback for every step
- ⚡ **Zero Config** - Works out of the box with settings.json
- 🎭 **All MCP Servers** - Manages 10+ servers automatically

## 🎯 Managed MCP Servers

| Server | Emoji | Description |
|--------|-------|-------------|
| Agent Loader | 🤖 | Dynamic agent context loading |
| Agent Context Hub | 🧠 | Multi-agent coordination |
| Agent Execution Hub | ⚡ | Agent execution engine |
| Fabric Integration | 🧵 | AI patterns for content processing |
| Workflow Loader | 🔄 | n8n workflow access |
| Context7 | 📚 | Enhanced context management |
| Sequential Thinking | 🧩 | Step-by-step reasoning |
| DeepWiki | 🌐 | Comprehensive knowledge base |
| Fetch | 🔍 | Web scraping capabilities |
| Playwright | 🎭 | Browser automation |

## 📦 Installation

```bash
cd .gemini/launcher
chmod +x install.sh
./install.sh
```

The installer will:
1. ✅ Check dependencies (Rust, Bun)
2. ✅ Build the release binary
3. ✅ Add `gemini-dev` alias to your shell
4. ✅ Create `./buddy` shortcut in project root
5. ✅ Offer to launch immediately

## 🚀 Usage

### Option 1: From Project Root
```bash
./buddy
```

### Option 2: Shell Alias (After Restart)
```bash
gemini-dev
```

### Option 3: Direct Binary
```bash
.gemini/launcher/target/release/gemini-launcher
```

## 🎬 What It Does

1. **Beautiful Startup**
   - Displays gorgeous ASCII banner
   - Lists all MCP servers being started
   - Shows real-time progress with spinners

2. **Parallel Server Launch**
   - Starts all 10 servers concurrently
   - Visual feedback for each server
   - Error handling with clear messages

3. **Initialization**
   - Progress bar for system initialization
   - Waits for all servers to be ready

4. **Launch Buddy AI**
   - Starts the Buddy AI interface
   - You interact with Buddy normally

5. **Clean Shutdown**
   - Press Ctrl+C when done
   - Automatically kills all MCP servers
   - Beautiful cleanup animation
   - No orphaned processes

## 🛠️ Development

### Build
```bash
cargo build --release
```

### Run Debug Build
```bash
cargo run
```

### Update Dependencies
```bash
cargo update
```

## 📁 Project Structure

```
.gemini/launcher/
├── Cargo.toml          # Rust dependencies and config
├── src/
│   └── main.rs         # Main launcher code
├── install.sh          # Beautiful installation script
├── README.md           # This file
└── target/
    └── release/
        └── gemini-launcher  # Compiled binary
```

## 🎨 UI Features

### Startup Animation
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         ✨  BUDDY AI MULTI-AGENT LAUNCHER  ✨            ║
║                                                           ║
║         Initializing Development Environment...          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

📦 MCP Servers: Starting up...

  ⠋ 🤖 Agent Loader starting...
  ⠙ 🧠 Agent Context Hub starting...
  ⠹ ⚡ Agent Execution Hub starting...
  ⠸ 🧵 Fabric Integration starting...
  ⠼ 🔄 Workflow Loader starting...
  ⠴ 📚 Context7 starting...
  ⠦ 🧩 Sequential Thinking starting...
  ⠧ 🌐 DeepWiki starting...
  ⠇ 🔍 Fetch starting...
  ⠏ 🎭 Playwright starting...

✨ All MCP servers initialized!

⏳ Initializing system [████████████████████████████████████████] 100%

🚀 Launching Buddy AI...

═══════════════════════════════════════════════════════════
```

### Shutdown Animation
```
═══════════════════════════════════════════════════════════

🧹 Shutting down MCP servers...

  ⠋ [████████████████████████████████████████] 10/10 servers

✓ All servers stopped cleanly

👋 Goodbye!
```

## 🔧 Configuration

The launcher reads from `.gemini/settings.json` automatically. No additional configuration needed!

It extracts:
- Server commands and arguments
- Environment variables
- Working directories
- All MCP server definitions

## 🐛 Troubleshooting

### Build Fails
```bash
# Update Rust
rustup update

# Clean build
cd .gemini/launcher
cargo clean
cargo build --release
```

### Servers Don't Start
- Check that Bun is installed: `bun --version`
- Check that npx is available: `npx --version`
- Check that uvx is available: `uvx --version`

### Alias Doesn't Work
```bash
# Manually reload shell config
source ~/.zshrc  # or ~/.bashrc

# Or restart terminal
```

## 📝 Dependencies

- **Rust** - Language runtime
- **Bun** - JavaScript runtime for MCP servers
- **Node.js/npx** - For npm-based MCP servers
- **Python/uvx** - For Python-based MCP servers

## 🎯 Why Rust?

- ⚡ **Fast** - Compiled binary, instant execution
- 🔒 **Safe** - Memory safety guarantees
- 🎨 **Beautiful** - Great terminal UI libraries
- 🔧 **Reliable** - Strong error handling
- 📦 **Single Binary** - No runtime dependencies
- 🌍 **Cross-platform** - Works everywhere

## 📄 License

Part of the Buddy AI Multi-Agent Development Team project.

## 🙏 Credits

Built with:
- [colored](https://crates.io/crates/colored) - Terminal colors
- [indicatif](https://crates.io/crates/indicatif) - Progress bars
- [tokio](https://crates.io/crates/tokio) - Async runtime
- [ctrlc](https://crates.io/crates/ctrlc) - Signal handling

---

**Made with 💙 by the Dev Team**

*"Launch fast, code faster, shutdown clean."*
