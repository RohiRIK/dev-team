#!/usr/bin/env bun

/**
 * Test script for agent-context-hub MCP
 * Tests the async/await fix for initialize_agent
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testInitializeAgent() {
  console.log('🧪 Testing agent-context-hub MCP...\n');

  // Start the MCP server
  const transport = new StdioClientTransport({
    command: 'bun',
    args: ['.gemini/mcp/agent-context-hub/src/index.ts'],
    env: {
      ...process.env,
      AGENTS_PATH: '.gemini/agents',
      LOG_LEVEL: 'info'
    }
  });

  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  }, {
    capabilities: {}
  });

  try {
    await client.connect(transport);
    console.log('✅ Connected to agent-context-hub\n');

    // List available tools
    const toolsList = await client.listTools();
    console.log(`📋 Available tools: ${toolsList.tools.map(t => t.name).join(', ')}\n`);

    // Test initialize_agent - THIS WAS BROKEN BEFORE
    console.log('🔧 Testing initialize_agent...');
    const result = await client.callTool({
      name: 'initialize_agent',
      arguments: {
        sessionId: 'test-session-123',
        agentName: 'product-manager',
        clearPreviousContext: true
      }
    });

    if (result.isError) {
      console.error('❌ ERROR:', result.content);
      process.exit(1);
    }

    console.log('✅ initialize_agent SUCCESS!\n');
    console.log('📦 Response:', JSON.stringify(result.content, null, 2));
    
    console.log('\n✨ All tests passed! The async/await fix works!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the test
testInitializeAgent().catch(console.error);
