/**
 * Layer 1: Resources - Agent Registry
 * 
 * Manages agent discovery, loading, and configuration
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import type { AgentConfig, LoadedAgent, AgentLoader } from '../types.js';

const AGENTS_DIR = '.gemini/agents';

export class AgentRegistry implements AgentLoader {
  private agentsCache: Map<string, LoadedAgent> = new Map();
  private lastRefresh: Date | null = null;
  private readonly CACHE_TTL_MS = 300000; // 5 minutes

  /**
   * Get all available agents from the filesystem
   */
  async getAllAgents(): Promise<LoadedAgent[]> {
    // Refresh cache if expired
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }

    return Array.from(this.agentsCache.values());
  }

  /**
   * Get a specific agent by name
   */
  async getAgent(name: string): Promise<LoadedAgent | undefined> {
    // Check cache first
    if (this.agentsCache.has(name) && !this.shouldRefreshCache()) {
      return this.agentsCache.get(name);
    }

    // Load from filesystem
    try {
      const agent = await this.loadAgentFromDisk(name);
      if (agent) {
        this.agentsCache.set(name, agent);
      }
      return agent;
    } catch (error) {
      console.error(`Error loading agent ${name}:`, error);
      return undefined;
    }
  }

  /**
   * Refresh the entire agent cache
   */
  private async refreshCache(): Promise<void> {
    try {
      const agentDirs = await readdir(AGENTS_DIR, { withFileTypes: true });
      const loadPromises: Promise<void>[] = [];

      for (const dirent of agentDirs) {
        if (dirent.isDirectory() && !dirent.name.startsWith('_')) {
          loadPromises.push(
            this.loadAgentFromDisk(dirent.name).then(agent => {
              if (agent) {
                this.agentsCache.set(agent.name, agent);
              }
            }).catch(error => {
              console.warn(`Could not load agent ${dirent.name}:`, error);
            })
          );
        }
      }

      await Promise.all(loadPromises);
      this.lastRefresh = new Date();
    } catch (error) {
      console.error('Error refreshing agent cache:', error);
    }
  }

  /**
   * Load a single agent from disk
   */
  private async loadAgentFromDisk(name: string): Promise<LoadedAgent | undefined> {
    try {
      const agentPath = join(AGENTS_DIR, name);

      // Load agent.json
      const configPath = join(agentPath, 'agent.json');
      const configContent = await readFile(configPath, 'utf-8');
      const config: AgentConfig = JSON.parse(configContent);

      // Load agent.md (system prompt)
      const systemPromptPath = join(agentPath, 'agent.md');
      const systemPrompt = await readFile(systemPromptPath, 'utf-8');

      // Load knowledge files
      const knowledge = await this.loadKnowledgeFiles(agentPath);

      // Load MCP configuration if exists
      const mcpConfig = await this.loadMCPConfig(agentPath);

      return {
        name,
        description: config.description,
        config,
        systemPrompt,
        knowledge,
        tools: config.tools || [],
        mcpConfig: mcpConfig || {},
        path: agentPath,
      };
    } catch (error) {
      console.error(`Error loading agent ${name} from disk:`, error);
      return undefined;
    }
  }

  /**
   * Load knowledge files from agent's knowledge directory
   */
  private async loadKnowledgeFiles(agentPath: string): Promise<Map<string, string>> {
    const knowledge = new Map<string, string>();
    try {
      const knowledgePath = join(agentPath, 'knowledge');
      const knowledgeFiles = await readdir(knowledgePath);

      for (const file of knowledgeFiles) {
        if (file.endsWith('.md') || file.endsWith('.txt')) {
          const content = await readFile(join(knowledgePath, file), 'utf-8');
          knowledge.set(file, content);
        }
      }
    } catch (error) {
      // Knowledge directory is optional
    }
    return knowledge;
  }

  /**
   * Load MCP server configuration
   */
  private async loadMCPConfig(agentPath: string): Promise<Record<string, any> | undefined> {
    try {
      const mcpConfigPath = join(agentPath, 'mcp-config.json');
      const content = await readFile(mcpConfigPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // MCP config is optional
      return undefined;
    }
  }

  /**
   * Check if cache should be refreshed
   */
  private shouldRefreshCache(): boolean {
    if (!this.lastRefresh) return true;
    const now = new Date().getTime();
    const lastRefreshTime = this.lastRefresh.getTime();
    return (now - lastRefreshTime) > this.CACHE_TTL_MS;
  }

  /**
   * Force refresh the cache
   */
  async forceRefresh(): Promise<void> {
    this.agentsCache.clear();
    await this.refreshCache();
  }
}
