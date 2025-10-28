#!/bin/bash
# Test script for Agent Context Hub MCP Server

echo "🧪 Testing Agent Context Hub MCP Server..."
echo ""

# Test 1: List Tools
echo "📋 Test 1: Listing available tools..."
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | bun src/index.ts 2>&1 | grep -A 50 "tools"

echo ""
echo "---"
echo ""

# Test 2: List Resources
echo "📦 Test 2: Listing available resources..."
echo '{"jsonrpc":"2.0","id":2,"method":"resources/list"}' | bun src/index.ts 2>&1 | grep -A 50 "resources"

echo ""
echo "✅ Tests complete!"
