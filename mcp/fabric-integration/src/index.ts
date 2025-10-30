import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

const server = new McpServer({
  name: 'fabric-integration',
  version: '1.0.0',
  description: 'Fabric-AI pattern execution for Gemini CLI'
});

/**
 * List all available fabric patterns
 */
server.registerTool(
  'list_fabric_patterns',
  {
    title: 'List Fabric Patterns',
    description: 'Get a list of all available fabric-ai patterns installed on the system',
    inputSchema: z.object({}).shape
  },
  async () => {
    try {
      const { stdout } = await execAsync('fabric-ai --listpatterns');
      const patterns = stdout.trim().split('\n').filter(p => p.length > 0);
      
      return {
        content: [{ 
          type: 'text' as const,
          text: JSON.stringify({ 
            patterns,
            count: patterns.length 
          }, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ 
          type: 'text' as const,
          text: `Error listing patterns: ${errorMessage}\n\nMake sure fabric is installed via Homebrew: brew install fabric` 
        }],
        isError: true
      };
    }
  }
);

/**
 * Execute a fabric pattern on input text
 */
server.registerTool(
  'run_fabric_pattern',
  {
    title: 'Run Fabric Pattern',
    description: 'Execute a fabric-ai pattern on the provided input text',
    inputSchema: z.object({
      pattern: z.string().describe('Pattern name (e.g., extract_wisdom, summarize, analyze_claims)'),
      input: z.string().describe('Input text to process with the pattern')
    }).shape
  },
  async ({ pattern, input }: { pattern: string; input: string }) => {
    // Create temporary file for input
    const tempFile = join(tmpdir(), `fabric-input-${Date.now()}.txt`);
    
    try {
      // Write input to temp file
      await writeFile(tempFile, input, 'utf-8');
      
      const { stdout } = await execAsync(`fabric-ai --pattern ${pattern} < ${tempFile}`);
      
      // Clean up temp file
      await unlink(tempFile);
      
      return {
        content: [{ 
          type: 'text' as const,
          text: stdout
        }]
      };
    } catch (error) {
      // Ensure temp file is cleaned up
      try {
        await unlink(tempFile);
      } catch {}
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ 
          type: 'text' as const,
          text: `Error running pattern '${pattern}': ${errorMessage}\n\nVerify the pattern exists with list_fabric_patterns` 
        }],
        isError: true
      };
    }
  }
);

/**
 * Get detailed information about a fabric pattern
 */
server.registerTool(
  'get_fabric_pattern_info',
  {
    title: 'Get Fabric Pattern Info',
    description: 'Get detailed information and usage instructions for a specific fabric pattern',
    inputSchema: z.object({
      pattern: z.string().describe('Pattern name to get info about')
    }).shape
  },
  async ({ pattern }: { pattern: string }) => {
    try {
      // Try to get pattern system prompt (contains description)
      const { stdout, stderr } = await execAsync(`fabric-ai --pattern ${pattern} --help 2>&1`);
      
      if (stderr && !stdout) { // If there's stderr and no stdout, it's likely an an error from fabric
        return {
          content: [{ 
            type: 'text' as const,
            text: `Error getting info for pattern '${pattern}': ${stderr.trim()}` 
          }],
          isError: true
        };
      }

      return {
        content: [{ 
          type: 'text' as const,
          text: stdout.trim() || `Pattern: ${pattern}\n\nNo detailed help available. Run this pattern using run_fabric_pattern tool.`
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ 
          type: 'text' as const,
          text: `Error getting info for pattern '${pattern}': ${errorMessage}\n\nVerify the pattern name and fabric installation via Homebrew.` 
        }],
        isError: true
      };
    }
  }
);

/**
 * Run multiple patterns in sequence
 */
server.registerTool(
  'run_fabric_pipeline',
  {
    title: 'Run Fabric Pipeline',
    description: 'Run multiple fabric patterns in sequence, using output of one as input to the next',
    inputSchema: z.object({
      patterns: z.array(z.string()).describe('Array of pattern names to run in sequence'),
      input: z.string().describe('Initial input text')
    }).shape
  },
  async ({ patterns, input }: { patterns: string[]; input: string }) => {
    let currentInput = input;
    const results: Array<{ pattern: string; output: string }> = [];
    
    try {
      for (const pattern of patterns) {
        const tempFile = join(tmpdir(), `fabric-pipeline-${Date.now()}.txt`);
        await writeFile(tempFile, currentInput, 'utf-8');
        
        const { stdout } = await execAsync(`fabric-ai --pattern ${pattern} < ${tempFile}`);
        await unlink(tempFile);
        
        results.push({ pattern, output: stdout });
        currentInput = stdout; // Use output as input for next pattern
      }
      
      return {
        content: [{ 
          type: 'text' as const,
          text: JSON.stringify({ 
            pipeline: patterns,
            results,
            final_output: currentInput 
          }, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ 
          type: 'text' as const,
          text: `Error in pipeline: ${errorMessage}\n\nCompleted steps:\n${JSON.stringify(results, null, 2)}` 
        }],
        isError: true
      };
    }
  }
);

// Start the MCP server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Fabric Integration MCP server running on stdio');
console.error('Available tools: list_fabric_patterns, run_fabric_pattern, get_fabric_pattern_info, run_fabric_pipeline');
