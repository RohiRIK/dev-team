# Git CLI Tools: A Comprehensive Guide

This document provides a comprehensive guide to Git Command Line Interface (CLI) tools, ranging from basic to advanced commands. Each command includes an explanation of its purpose, common use cases, and examples to help you effectively manage your repositories and collaborate with others.

---

## 1. Basic Git Commands

These are the fundamental commands you'll use most frequently.

### `git init`
- **Purpose:** Initializes a new Git repository in the current directory.
- **When to use:** When starting a new project that you want to track with Git.
- **Example:**
  ```bash
  git init
  ```

### `git clone <repository-url>`
- **Purpose:** Creates a local copy of a remote Git repository.
- **When to use:** When you want to start working on an existing project.
- **Example:**
  ```bash
  git clone https://github.com/user/repo.git
  ```

### `git add <file(s)>`
- **Purpose:** Stages changes for the next commit. You can specify individual files, directories, or use `.` to stage all changes.
- **When to use:** After modifying files and before committing, to select which changes to include in the commit.
- **Examples:**
  ```bash
  git add index.html style.css
  git add .
  git add src/
  ```

### `git commit -m "<message>"`
- **Purpose:** Records the staged changes to the repository with a descriptive message.
- **When to use:** After staging changes, to save a snapshot of your work.
- **Example:**
  ```bash
  git commit -m "feat: Add initial homepage structure"
  ```

### `git status`
- **Purpose:** Shows the status of your working directory and staging area, including modified, staged, and untracked files.
- **When to use:** Frequently, to see the current state of your repository.
- **Example:**
  ```bash
  git status
  ```

### `git log`
- **Purpose:** Displays the commit history of the current branch.
- **When to use:** To review past commits, understand changes, or find specific commits.
- **Examples:**
  ```bash
  git log
  git log --oneline # Shorter, one-line per commit
  git log --graph --oneline --all # Visualize branch history
  ```

### `git diff`
- **Purpose:** Shows the differences between various states of your repository (e.g., working directory vs. staging area, two commits).
- **When to use:** To review changes before staging or committing, or to compare different versions of your code.
- **Examples:**
  ```bash
  git diff # Changes in working directory not yet staged
  git diff --staged # Changes in staging area not yet committed
  git diff HEAD # Changes in working directory vs. last commit
  git diff <commit1> <commit2> # Differences between two commits
  ```

### `git branch`
- **Purpose:** Lists, creates, or deletes branches.
- **When to use:** To manage your branches for feature development or bug fixes.
- **Examples:**
  ```bash
  git branch # List all local branches
  git branch new-feature # Create a new branch
  git branch -d old-branch # Delete a local branch
  ```

### `git checkout <branch-name>` / `git switch <branch-name>`
- **Purpose:** Switches to a different branch or restores working tree files.
- **When to use:** To move between different lines of development.
- **Examples:**
  ```bash
  git checkout develop
  git checkout -b new-feature # Create and switch to a new branch
  git switch develop # Modern alternative to checkout for switching branches
  git switch -c new-feature # Create and switch to a new branch (modern)
  ```

### `git merge <branch-name>`
- **Purpose:** Integrates changes from one branch into the current branch.
- **When to use:** To combine completed features or bug fixes into a main development branch.
- **Example:**
  ```bash
  git checkout main
  git merge feature-branch
  ```

### `git pull`
- **Purpose:** Fetches changes from a remote repository and integrates them into the current branch (fetch + merge).
- **When to use:** To update your local repository with the latest changes from the remote.
- **Example:**
  ```bash
  git pull origin main
  ```

### `git push`
- **Purpose:** Uploads local branch commits to the remote repository.
- **When to use:** To share your local changes with others or to update the remote repository.
- **Example:**
  ```bash
  git push origin main
  ```

---

## 2. Intermediate Git Commands

These commands offer more control and flexibility in managing your repository.

### `git remote`
- **Purpose:** Manages the set of tracked repositories.
- **When to use:** To add, remove, or rename remote repositories.
- **Examples:**
  ```bash
  git remote -v # List remotes
  git remote add origin https://github.com/user/repo.git # Add a remote
  ```

### `git fetch`
- **Purpose:** Downloads objects and refs from another repository.
- **When to use:** To get the latest changes from a remote without merging them into your current branch.
- **Example:**
  ```bash
  git fetch origin
  ```

### `git rebase <base-branch>`
- **Purpose:** Reapplies commits on top of another base tip. It rewrites commit history.
- **When to use:** To maintain a clean, linear project history, especially before merging a feature branch into `main`.
- **Example:**
  ```bash
  git checkout feature-branch
  git rebase main
  ```

### `git rebase -i` (Interactive Rebase)
- **Purpose:** Allows you to modify individual commits, squash them together, drop them, or change their order, providing fine-grained control over your commit history.
- **How it works:** When you start an interactive rebase (e.g., `git rebase -i HEAD~N`), Git opens a text editor with a list of commits. You can then specify actions for each commit:
  - `pick`: Use the commit as is.
  - `reword`: Change the commit message.
  - `edit`: Amend the commit (change files, add/remove, then `git commit --amend`).
  - `squash`: Combine the commit with the previous one, merging their messages.
  - `fixup`: Combine the commit with the previous one, discarding its message.
  - `drop`: Remove the commit.
- **When to use:**
  - Cleaning up messy commit history before pushing to a shared branch.
  - Combining small, related commits into a single, more meaningful one.
  - Correcting mistakes in past commits, like typos or forgotten files.
  - Reordering commits.
- **Command:**
  ```bash
  git rebase -i <commit-hash>
  git rebase -i HEAD~N # Rebase the last N commits
  ```

### `git reset <mode> <commit>`
- **Purpose:** Undoes changes by moving HEAD and optionally resetting the index and working tree.
- **When to use:** To unstage changes, uncommit commits, or discard local changes.
- **Modes:**
  - `--soft`: Moves HEAD, keeps changes in staging area.
  - `--mixed` (default): Moves HEAD, unstages changes, keeps changes in working directory.
  - `--hard`: Moves HEAD, discards all changes in staging area and working directory.
- **Examples:**
  ```bash
  git reset HEAD~1 # Uncommit the last commit (mixed mode)
  git reset --hard HEAD # Discard all local changes
  ```

### `git revert <commit>`
- **Purpose:** Creates a new commit that undoes the changes introduced by a specified commit.
- **When to use:** To undo changes that have already been pushed to a shared remote repository, as it doesn't rewrite history.
- **Example:**
  ```bash
  git revert <commit-hash>
  ```

### `git stash`
- **Purpose:** Temporarily saves changes that are not ready to be committed.
- **When to use:** When you need to switch branches quickly but have uncommitted changes you want to save.
- **Examples:**
  ```bash
  git stash save "Work in progress on feature X"
  git stash list
  git stash pop # Apply the most recent stash and remove it from the stash list
  git stash apply # Apply the most recent stash, keeping it in the stash list
  ```

---

## 3. Advanced Git Commands

These commands are for more complex scenarios and repository management.

### `git reflog`
- **Purpose:** Records updates to the tip of branches and other references in the local repository's history.
- **When to use:** To recover lost commits or branches, as it shows a history of where HEAD has been.
- **Example:**
  ```bash
  git reflog
  ```

### `git cherry-pick <commit>`
- **Purpose:** Applies the changes introduced by some existing commits from another branch onto the current branch.
- **When to use:** To selectively bring specific commits from one branch to another without merging the entire branch.
- **Example:**
  ```bash
  git cherry-pick <commit-hash>
  ```

### `git bisect`
- **Purpose:** Finds the commit that introduced a bug using a binary search.
- **When to use:** To efficiently pinpoint the exact commit that caused a regression.
- **Example:**
  ```bash
  git bisect start
  git bisect bad # Mark current commit as bad
  git bisect good <good-commit-hash> # Mark a known good commit
  git bisect run <test-script> # Automate the bisection process
  ```

### `git submodule`
- **Purpose:** Manages repositories embedded within other repositories.
- **When to use:** When your project depends on another project and you want to keep them separate but track them together.
- **Example:**
  ```bash
  git submodule add https://github.com/user/submodule.git path/to/submodule
  git submodule update --init --recursive
  ```

### `git worktree`
- **Purpose:** Manages multiple working trees attached to the same repository.
- **When to use:** To work on multiple branches of the same repository simultaneously without switching branches in your main working directory.
- **Example:**
  ```bash
  git worktree add ../new-feature-work new-feature
  ```

---

## 4. Configuration

### `git config`
- **Purpose:** Gets and sets repository or global options.
- **When to use:** To configure your Git username, email, default editor, and other settings.
- **Examples:**
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  git config --list # View all configurations
  ```
