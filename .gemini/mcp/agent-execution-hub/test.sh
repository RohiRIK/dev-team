#!/usr/bin/env bash

# Test script for Agent Execution Hub
# Demonstrates end-to-end agent execution

set -e

echo "=== Agent Execution Hub Test ==="
echo ""

# Test 1: List tools
echo "Test 1: List available tools"
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  bun src/index.ts 2>/dev/null | \
  jq '.result.tools[].name'
echo ""

# Test 2: Get agent config
echo "Test 2: Load github-manager configuration"
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_agent_config","arguments":{"agentName":"github-manager"}}}' | \
  bun src/index.ts 2>/dev/null | \
  jq '.result.content[0].text | fromjson | .config.name'
echo ""

# Test 3: Execute agent (requires GEMINI_API_KEY)
if [ -n "$GEMINI_API_KEY" ]; then
  echo "Test 3: Execute github-manager agent"
  echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"execute_agent","arguments":{"agentName":"github-manager","task":"Say hello and introduce yourself"}}}' | \
    bun src/index.ts 2>/dev/null | \
    jq '.result.content[0].text | fromjson'
else
  echo "Test 3: Skipped (GEMINI_API_KEY not set)"
fi

echo ""
echo "=== All tests completed ==="
