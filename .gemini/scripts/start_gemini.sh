#!/bin/bash

# --- Color Definitions ---
PURPLE='\033[0;35m'
BRIGHT_PURPLE='\033[1;35m'
CYAN='\033[0;36m'
BRIGHT_CYAN='\033[1;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
WHITE='\033[1;37m'
BOLD='\033[1m'
RESET='\033[0m'

# --- Welcome Window ---
echo -e "${BRIGHT_PURPLE}"
cat << 'EOF'
    ____            __    __       
   / __ )__  ______/ /___/ /_  __  
  / __  / / / / __  / __  / / / /  
 / /_/ / /_/ / /_/ / /_/ / /_/ /   
/_____/\__,_/\__,_/\__,_/\__, /    
                        /____/     
EOF
echo -e "${RESET}${BRIGHT_CYAN}    AI Companion & System Orchestrator${RESET}"
echo -e "${WHITE}    \"because everyone needs somebody\"${RESET}"
echo ""

# --- Configuration ---
# Define the path to your project root
PROJECT_ROOT="./"

# --- Prerequisites Check and Installation ---
echo -e "${CYAN}Checking prerequisites...${RESET}"

# Check Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}Homebrew not found. Installing...${RESET}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo -e "${GREEN}✓ Homebrew found${RESET}"
fi

# Check Bun
if ! command -v bun &> /dev/null; then
    echo -e "${YELLOW}Bun not found. Installing...${RESET}"
    curl -fsSL https://bun.sh/install | bash
    
    # Source bun environment
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    
    # Add to shell profile
    if [[ -f ~/.zshrc ]]; then
        echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.zshrc
        echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.zshrc
    fi
else
    echo -e "${GREEN}✓ Bun found${RESET}"
fi

# Check uv (Python package manager)
if ! command -v uv &> /dev/null; then
    echo -e "${YELLOW}uv not found. Installing...${RESET}"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
else
    echo -e "${GREEN}✓ uv found${RESET}"
fi

# Check fabric-ai
if ! fabric-ai --version &> /dev/null; then
    echo -e "${YELLOW}fabric-ai not found. Installing via Homebrew...${RESET}"
    brew install fabric-ai
else
    echo -e "${GREEN}✓ fabric-ai found${RESET}"
fi

# Check Node.js (for npx commands)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing...${RESET}"
    brew install node
else
    echo -e "${GREEN}✓ Node.js found${RESET}"
fi

# Check Gemini CLI
if ! command -v gemini &> /dev/null; then
    echo -e "${YELLOW}Gemini CLI not found. Installing...${RESET}"
    brew install gemini-cli
else
    echo -e "${GREEN}✓ Gemini CLI found${RESET}"
    # Silently check and update if needed
    brew outdated gemini-cli &> /dev/null && brew upgrade gemini-cli > /dev/null 2>&1
fi

# Install project dependencies
echo -e "${CYAN}Installing project dependencies...${RESET}"
cd "$PROJECT_ROOT" && bun install > /dev/null 2>&1
echo -e "${GREEN}  ✓ Dependencies installed${RESET}"

# Ensure PATH includes all necessary directories (without sourcing .zshrc)
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.cargo/bin:/opt/homebrew/bin:$PATH"

echo -e "${BRIGHT_PURPLE}✓ All prerequisites checked and installed!${RESET}"
echo ""

# Clean up any old PID files
rm -f "$PROJECT_ROOT/.mcp_pids"

echo -e "${WHITE}Starting Gemini CLI...${RESET}"
echo -e "${CYAN}  (MCP servers will be managed by Gemini CLI)${RESET}"
echo ""

# --- Trap to clean up on script exit ---
trap ' \
    echo -e "\n${YELLOW}⚠ Gemini CLI exited. Cleaning up...${RESET}" \
    rm -f "$PROJECT_ROOT/.mcp_pids" \
    echo -e "${BRIGHT_PURPLE}✓ Cleanup complete${RESET}" \
' EXIT

# --- Start Gemini CLI ---
(cd "$PROJECT_ROOT" && gemini)