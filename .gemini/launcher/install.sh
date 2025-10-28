#!/bin/bash

# Beautiful installation script for Gemini Launcher

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

print_banner() {
    echo ""
    echo -e "${CYAN}${BOLD}"
    echo "  ╔═══════════════════════════════════════════════════════════╗"
    echo "  ║                                                           ║"
    echo "  ║         🦀  Buddy LAUNCHER INSTALLER  🦀                ║"
    echo "  ║                                                           ║"
    echo "  ╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "\n  ${CYAN}▸${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "    ${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "    ${RED}✗${NC} ${RED}$1${NC}"
}

print_info() {
    echo -e "    ${DIM}$1${NC}"
}

spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf "    ${CYAN}%c${NC}  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

print_banner

# Check if Rust is installed
print_step "Checking dependencies..."

if ! command -v cargo &> /dev/null; then
    print_error "Rust is not installed"
    print_info "Install Rust from: https://rustup.rs/"
    exit 1
fi
print_success "Rust/Cargo found"

if ! command -v bun &> /dev/null; then
    print_error "Bun is not installed"
    print_info "Install Bun from: https://bun.sh/"
    exit 1
fi
print_success "Bun found"

# Build the project
print_step "Building Buddy AI Launcher (Release mode)..."

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

cargo build --release 2>&1 | grep -E "(Compiling|Finished)" &
BUILD_PID=$!

spinner $BUILD_PID
wait $BUILD_PID
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed"
    exit 1
fi

BINARY_PATH="$SCRIPT_DIR/target/release/gemini-launcher"

if [ ! -f "$BINARY_PATH" ]; then
    print_error "Binary not found at $BINARY_PATH"
    exit 1
fi

# Determine shell config file
print_step "Configuring shell..."

SHELL_CONFIG=""
SHELL_NAME=""

if [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
    SHELL_NAME="bash"
fi

if [ -n "$SHELL_CONFIG" ]; then
    # Check if alias already exists
    if grep -q "alias gemini-dev=" "$SHELL_CONFIG"; then
        # Remove old alias
        sed -i.bak '/alias gemini-dev=/d' "$SHELL_CONFIG"
        print_info "Removed old alias"
    fi
    
    # Add new alias
    echo "" >> "$SHELL_CONFIG"
    echo "# Gemini AI Launcher" >> "$SHELL_CONFIG"
    echo "alias gemini-dev='$BINARY_PATH'" >> "$SHELL_CONFIG"
    
    print_success "Alias added to $SHELL_CONFIG"
    print_info "Shell: $SHELL_NAME"
else
    print_error "Could not find shell config file"
    print_info "Manually add: alias gemini-dev='$BINARY_PATH'"
fi

# Create a convenient symlink in project root
print_step "Creating launcher shortcut..."

PROJECT_ROOT="$SCRIPT_DIR/../.."
LAUNCHER_LINK="$PROJECT_ROOT/buddy"

if [ -L "$LAUNCHER_LINK" ] || [ -f "$LAUNCHER_LINK" ]; then
    rm "$LAUNCHER_LINK"
fi

ln -s "$BINARY_PATH" "$LAUNCHER_LINK"
chmod +x "$LAUNCHER_LINK"
print_success "Created ./buddy shortcut"

# Final banner
echo ""
echo -e "${GREEN}${BOLD}"
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║                                                           ║"
echo "  ║              ✨  INSTALLATION COMPLETE!  ✨              ║"
echo "  ║                                                           ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n  ${YELLOW}Usage:${NC}\n"
echo -e "    ${BOLD}Option 1:${NC} ${DIM}Run from project root${NC}"
echo -e "    ${CYAN}./buddy${NC}\n"

echo -e "    ${BOLD}Option 2:${NC} ${DIM}Use shell alias (after restart)${NC}"
echo -e "    ${CYAN}gemini-dev${NC}\n"

echo -e "    ${BOLD}Option 3:${NC} ${DIM}Activate now (no restart needed)${NC}"
echo -e "    ${CYAN}source $SHELL_CONFIG && gemini-dev${NC}\n"

echo -e "  ${DIM}Press Ctrl+C to exit Buddy AI and cleanup all servers${NC}\n"

# Ask if user wants to run now
echo -e -n "  ${YELLOW}❯${NC} ${BOLD}Launch Buddy AI now? (y/N):${NC} "
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    "$BINARY_PATH"
else
    echo -e "\n  ${GREEN}👋 Run ${CYAN}./buddy${GREEN} when you're ready!${NC}\n"
fi
