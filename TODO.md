

# TODO: Update Buddy for New Repo Structure

Now that `agents/`, `mcp/`, `launcher/`, and `settings.json` are at the project root (not in `.gemini/`), here are the steps to check and update:


## Migration Tasks for New Structure

### 1. Update Agent References and Paths
- [ ] Change all agent references and paths to their correct locations, including:
	- agent.md
	- agent.json
	- tools and related files
	- Any other agent-related files or configs

### 2. Update Scripts, MCPs, and Configs
- [ ] Update any scripts, MCPs, configs, or environment variables that reference old `.gemini` paths to use new root paths.

### 3. Convert agent.md and Fix settings.json
- [ ] Change `agent.md` to agent JSON format as needed.
- [ ] Fix and verify `settings.json` for new structure and correct references.

### 4. Verify Build and Run
- [ ] Build the Rust launcher from the new location.
- [ ] Start MCP servers and agents from the new root paths.
- [ ] Run any integration tests to confirm everything works.

### 5. Update Documentation
- [ ] Update `README.md` to reflect new folder structure and usage instructions.
- [ ] Remove any `.gemini`-specific setup steps.

### 6. Clean Up
- [ ] Remove any obsolete `.gemini` references or files if not needed.
- [ ] Confirm only dev-team agents and code are present (no bridge/bot/morte agents).

---

### 7. Final Test
- [ ] Test the Buddy app after all path and config fixes to ensure everything works as expected.

Add more items as needed during migration. Check off each item as you complete it.
