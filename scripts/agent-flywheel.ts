#!/usr/bin/env bun
/**
 * Agent Development Flywheel
 * 
 * This script manages the complete agent lifecycle:
 * 1. Create
 * 2. Test
 * 3. Deploy
 * 4. Monitor
 * 5. Iterate
 */

import { readFile, readdir, writeFile } from 'fs/promises';
import { join } from 'path';

interface AgentMetrics {
  slug: string;
  name: string;
  status: string;
  lastTested: string;
  score: number;
  issues: string[];
}

async function listAgents(): Promise<AgentMetrics[]> {
  const agentsDir = 'agents';
  const dirs = await readdir(agentsDir);
  const agents: AgentMetrics[] = [];

  for (const dir of dirs) {
    if (dir.startsWith('_')) continue; // Skip _shared and _template

    try {
      const agentJsonPath = join(agentsDir, dir, 'agent.json');
      const agentJson = JSON.parse(await readFile(agentJsonPath, 'utf-8'));

      agents.push({
        slug: dir,
        name: agentJson.agent.name,
        status: agentJson.agent.status,
        lastTested: agentJson.agent.updated,
        score: 0, // Will be calculated by test
        issues: []
      });
    } catch (error) {
      console.error(`Error loading ${dir}:`, error);
    }
  }

  return agents;
}

async function generateReport() {
  console.log('📊 Agent Flywheel Dashboard\n');
  
  const agents = await listAgents();
  
  console.log(`Total Agents: ${agents.length}`);
  console.log(`Active: ${agents.filter(a => a.status === 'active').length}`);
  console.log(`In Development: ${agents.filter(a => a.status === 'development').length}\n`);

  console.log('Agents by Status:');
  console.table(agents.map(a => ({
    Name: a.name,
    Slug: a.slug,
    Status: a.status,
    'Last Updated': a.lastTested
  })));

  console.log('\n💡 Next Steps:');
  console.log('1. Create new agent: bun run create-agent');
  console.log('2. Test agent: bun run test-agent [slug]');
  console.log('3. List all agents: bun run agent-flywheel --list');
}

const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
🔄 Agent Development Flywheel

Usage: bun run agent-flywheel [command]

Commands:
  --list     List all agents
  --report   Generate dashboard report (default)
  --help     Show this help

The Agent Flywheel Process:
1. CREATE: Use create-agent to scaffold new agent
2. TEST: Use test-agent to validate structure
3. DEPLOY: Update agent status to 'active'
4. MONITOR: Track agent performance
5. ITERATE: Refine based on usage

  `);
  process.exit(0);
}

await generateReport();
