# MCP Servers Reference

## Agent Loader MCP

### Tools
1. **list_available_agents()**
   - Returns: Array of agent slugs
   - Use: Show available agents

2. **load_agent_context(agent_name)**
   - Params: agent_name (string)
   - Returns: agent.md content
   - Use: Get agent details

3. **load_agent_config(agent_name)**
   - Params: agent_name (string)
   - Returns: agent.json content
   - Use: Get agent configuration

4. **load_agent_knowledge(agent_name, file)**
   - Params: agent_name, knowledge_file
   - Returns: File content
   - Use: Access specific knowledge

5. **load_shared_context()**
   - Returns: Shared context
   - Use: Get global guidelines

6. **load_shared_tools()**
   - Returns: Shared tools docs
   - Use: Get common tools info

## Fabric Integration MCP

### Tools
1. **list_fabric_patterns()**
   - Returns: Array of pattern names
   - Use: Show available patterns

2. **run_fabric_pattern(pattern, input)**
   - Params: pattern name, input text
   - Returns: Processed output
   - Use: Execute AI pattern

3. **get_fabric_pattern_info(pattern)**
   - Params: pattern name
   - Returns: Pattern description
   - Use: Learn about pattern

4. **run_fabric_pipeline(patterns, input)**
   - Params: array of patterns, input
   - Returns: Final output after chain
   - Use: Chain multiple patterns

### Popular Patterns
- extract_wisdom: Extract insights
- summarize: Create summaries
- analyze_claims: Fact-check
- improve_writing: Enhance text
- explain_code: Code explanations
