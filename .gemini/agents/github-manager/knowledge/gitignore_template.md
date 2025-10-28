# .gitignore Template

This document provides a common .gitignore file content that covers many typical scenarios.

```
# Compiled source #
###################
*.com
*.class
*.dll
*.exe
*.o
*.so
*.dylib

# Packages #
############
# It's better to ignore the whole directory than to ignore each package type.
# For example, for Node.js projects:
node_modules/
# For Python projects:
__pycache__/
*.pyc
# For Java projects:
target/
# For Ruby projects:
vendor/bundle/

# Logs and databases #
######################
*.log
*.sql
*.sqlite
*.db

# OS generated files #
######################
.DS_Store # macOS
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db # Windows
[Tt]humbs.db
Desktop.ini

# IDE and editor files #
########################
.idea/ # IntelliJ IDEA
.vscode/ # VS Code
*.swp # Vim swap files
*.swo
*~ # Emacs backup files
.project # Eclipse
.classpath # Eclipse
.settings/ # Eclipse
.c9/ # Cloud9
*.sublime-project # Sublime Text
*.sublime-workspace # Sublime Text

# Build artifacts #
###################
build/
dist/
bin/
out/

# Temporary files #
###################
*.tmp
tmp/
temp/

# Configuration files #
#######################
# Sensitive configuration files that should not be committed
# e.g., API keys, database credentials
.env
.env.*
config.local.js
config.local.json

# Vagrant and Docker #
######################
.vagrant/
*.pem
*.key
.dockerignore # Often committed, but sometimes ignored if it's dynamically generated
```