#!/usr/bin/env bun
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface TestCase {
  scenario: string;
  input: string;
  expectedBehavior: string;
}

interface AgentTest {
  agentSlug: string;
  tests: TestCase[];
}

async function testAgent(agentSlug: string) {
  const agentPath = join('agents', agentSlug);

  if (!existsSync(agentPath)) {
    console.error(`❌ Agent '${agentSlug}' not found!`);
    process.exit(1);
  }

  console.log(`🧪 Testing Agent: ${agentSlug}\n`);

  // Load agent configuration
  const agentJsonPath = join(agentPath, 'agent.json');
  const agentJson = JSON.parse(await readFile(agentJsonPath, 'utf-8'));

  console.log(`📋 Agent: ${agentJson.agent.name}`);
  console.log(`📝 Description: ${agentJson.agent.description}`);
  console.log(`🎯 Role: ${agentJson.agent.role}\n`);

  // Validation checks
  const checks = {
    'agent.md exists': existsSync(join(agentPath, 'agent.md')),
    'agent.json is valid': !!agentJson.agent.name,
    'knowledge/ directory exists': existsSync(join(agentPath, 'knowledge')),
    'tools/ directory exists': existsSync(join(agentPath, 'tools')),
    'Has capabilities defined': agentJson.capabilities?.length > 0,
    'Has expertise defined': agentJson.expertise?.primary?.length > 0,
  };

  console.log('✅ Structure Validation:');
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? '✅' : '❌'} ${check}`);
  }

  // Load agent.md and analyze
  const agentContent = await readFile(join(agentPath, 'agent.md'), 'utf-8');
  
  const contentChecks = {
    'Has Role section': agentContent.includes('## Role'),
    'Has Capabilities section': agentContent.includes('## Core Capabilities'),
    'Has Workflow section': agentContent.includes('## Workflow'),
    'References knowledge files': agentContent.includes('knowledge/'),
    'Has example interactions': agentContent.includes('## Example'),
  };

  console.log('\n✅ Content Validation:');
  for (const [check, passed] of Object.entries(contentChecks)) {
    console.log(`  ${passed ? '✅' : '❌'} ${check}`);
  }

  // Knowledge files check
  const knowledgeFiles = await readdir(join(agentPath, 'knowledge'));
  console.log(`\n📚 Knowledge Files: ${knowledgeFiles.length}`);
  knowledgeFiles.forEach(file => console.log(`  - ${file}`));

  // Overall score
  const allChecks = { ...checks, ...contentChecks };
  const passedCount = Object.values(allChecks).filter(Boolean).length;
  const totalCount = Object.keys(allChecks).length;
  const score = ((passedCount / totalCount) * 100).toFixed(0);

  console.log(`\n🎯 Score: ${score}% (${passedCount}/${totalCount} checks passed)`);

  if (score === '100') {
    console.log('🎉 Agent is ready for deployment!');
  } else {
    console.log('⚠️  Agent needs improvements before deployment');
  }
}

// CLI
const agentSlug = process.argv[2];

if (!agentSlug || agentSlug === '--help') {
  console.log(`
🧪 Agent Tester

Usage: bun run test-agent [agent-slug]

Example:
  bun run test-agent tech-news-curator
  `);
  process.exit(0);
}

await testAgent(agentSlug);
