# Complete Tool Usage Reference

## Bun

#### Installation

```bas### File Operat## Git

### Common Commands

```bash
git clone <url>              # Clone repository
git checkout -b branch       # Create branch
git add . && git commit -m "msg"  # Commit changes
git push origin branch       # Push changes
git pull origin main         # Pull updates
git status                   # Check status
```

## Docker

### Common Commands

```bash
docker build -t name .       # Build image
docker run -p 8080:8080 name # Run container
docker ps                    # List containers
docker stop <id>             # Stop container
docker logs <id>             # View logs
```ons

```bash
ls -la               # List files
cp src dest          # Copy
mv src dest          # Move
rm file              # Delete
mkdir dir            # Create directory
touch file           # Create file
```

### Search

```bash
find . -name "*.ts"  # Find files
grep -r "text" .     # Search in files
```

### Process Management

```bash
ps aux               # List processes
kill PID             # Kill process
top                  # Monitor processes
```h -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Common Commands

```bash
brew install pkg      # Install
brew update           # Update Homebrew
brew upgrade          # Upgrade packages
brew search keyword   # Search
brew list             # List installed
brew uninstall pkg    # Remove
```stallation

```bash
curl -fsSL https://bun.sh/install | bash
```

### Common Commands

```bash
bun install           # Install dependencies
bun add pkg           # Add package
bun remove pkg        # Remove package
bun run script        # Run script
bun run dev           # Dev mode
bun run src/file.ts   # Run TypeScript directly
bun create            # Create project
```

## uv

### Installation

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Common Commands

```bash
uv pip install pkg    # Install package
uv venv               # Create venv
uv run script.py      # Run script
uv pip install -r requirements.txt
```


## Homebrew

### Installation
/bin/bash -c “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)”

### Common Commands
brew install pkg      # Installbrew update          # Update Homebrewbrew upgrade         # Upgrade packagesbrew search keyword  # Searchbrew list            # List installedbrew uninstall pkg   # Remove


## Shell

### File Operations
ls -la               # List filescp src dest          # Copymv src dest          # Moverm file              # Deletemkdir dir            # Create directorytouch file           # Create file


### Search

find . -name “*.ts”  # Find filesgrep -r “text” .     # Search in files

### Process Management
ps aux               # List processeskill PID             # Kill processtop                  # Monitor processes