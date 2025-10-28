import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import type { AgentConfig, LoadedAgent } from './types.js';
import type { AgentLoader } from './agent-loader.js'; // The interface

const AGENTS_DIR = '.gemini/agents'; // Relative path to agents directory

export class FileSystemAgentLoader implements AgentLoader {
  async getAllAgents(): Promise<LoadedAgent[]> {
    const agents: LoadedAgent[] = [];
    try {
      const agentDirs = await readdir(AGENTS_DIR, { withFileTypes: true });
      for (const dirent of agentDirs) {
        if (dirent.isDirectory() && !dirent.name.startsWith('_')) {
          try {
            const agentName = dirent.name;
            const configPath = join(AGENTS_DIR, agentName, 'agent.json');
            const configContent = await readFile(configPath, 'utf-8');
            const config: AgentConfig = JSON.parse(configContent);

            const systemPromptPath = join(AGENTS_DIR, agentName, 'agent.md');
            const systemPrompt = await readFile(systemPromptPath, 'utf-8');

            // Simplified for now, real implementation would load knowledge and tools
            agents.push({
              name: agentName,
              description: config.description || '',
              config: config,
              systemPrompt: systemPrompt,
              knowledge: new Map(),
              tools: [],
              mcpConfig: {},
              path: join(AGENTS_DIR, agentName),
            });
          } catch (error) {
            console.warn(`Could not load agent ${dirent.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error reading agents directory:', error);
    }
    return agents;
  }

  async getAgent(name: string): Promise<LoadedAgent | undefined> {
    try {
      const configPath = join(AGENTS_DIR, name, 'agent.json');
      const configContent = await readFile(configPath, 'utf-8');
      const config: AgentConfig = JSON.parse(configContent);

      const systemPromptPath = join(AGENTS_DIR, name, 'agent.md');
      const systemPrompt = await readFile(systemPromptPath, 'utf-8');

      // Simplified for now, real implementation would load knowledge and tools
      return {
        name: name,
        description: config.description || '',
        config: config,
        systemPrompt: systemPrompt,
        knowledge: new Map(),
        tools: [],
        mcpConfig: {},
        path: join(AGENTS_DIR, name),
      };
    } catch (error) {
      console.error(`Error loading agent ${name}:`, error);
      return undefined;
    }
  }
}
