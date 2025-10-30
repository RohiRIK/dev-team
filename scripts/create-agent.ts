#!/usr/bin/env bun
import { mkdir, writeFile, copyFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface AgentConfig {
  name: string;
  slug: string;
  description: string;
  role: string;
  capabilities: string[];
  expertise: { primary: string[]; secondary: string[] };
  tags: string[];
  languages: string[];
}

async function createAgent(config: AgentConfig) {
  const agentPath = join('agents', config.slug);
  
  // Check if agent already exists
  if (existsSync(agentPath)) {
    console.error(`❌ Agent '${config.slug}' already exists!`);
    process.exit(1);
  }

  console.log(`🚀 Creating agent: ${config.name}...`);

  // Create directory structure
  await mkdir(join(agentPath, 'knowledge'), { recursive: true });
  await mkdir(join(agentPath, 'tools'), { recursive: true });

  // Create agent.json
  const agentJson = {
    agent: {
      name: config.name,
      id: config.slug,
      version: '1.0.0',
      description: config.description,
      role: config.role,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    },
    capabilities: config.capabilities,
    expertise: config.expertise,
    tools: [],
    model: {
      preferred: 'gemini-2.0-flash-exp',
      temperature: 0.7,
      maxTokens: 8000
    },
    context: {
      maxHistoryTurns: 50,
      includeShared: true,
      knowledgeFiles: []
    },
    tags: config.tags,
    languages: config.languages,
    integrations: {
      fabric: true,
      mcp: true
    }
  };

  await writeFile(
    join(agentPath, 'agent.json'),
    JSON.stringify(agentJson, null, 2)
  );

  // Create GEMINI.md
  const geminiMd = `# ${config.name} Agent

## Role
You are a ${config.role}. Your primary responsibility is to ${config.description.toLowerCase()}.

## Core Capabilities
${config.capabilities.map(cap => `- ${cap}`).join('\n')}

## Expertise Areas
${config.expertise.primary.map(exp => `- ${exp}`).join('\n')}

## Communication Style
- Professional and helpful
- Clear and concise
- Always verify understanding before proceeding

## Workflow Process
1. **Understand**: Ask clarifying questions
2. **Analyze**: Break down the problem
3. **Plan**: Outline approach
4. **Execute**: Implement solution
5. **Verify**: Confirm results
6. **Document**: Provide documentation

## Tools Access
You have access to:
- Fabric-AI patterns for content processing
- Shared tools from agents/_shared/tools.md

## Knowledge Base
Reference knowledge files in the knowledge/ directory when needed.

## Shared Resources
Access shared resources from agents/_shared/:
- tools.md - Common tools
- context.md - Global guidelines
- prompts.md - Reusable templates

## Best Practices
- Always prioritize accuracy
- Provide clear explanations
- Document your work

## Success Metrics
Your performance is measured by:
- Task completion accuracy
- Response clarity
- User satisfaction
`;

  await writeFile(join(agentPath, 'agent.md'), geminiMd);

  // Create placeholder knowledge files
  await writeFile(
    join(agentPath, 'knowledge', 'README.md'),
    `# ${config.name} Knowledge Base\n\nAdd specialized knowledge files here.`
  );

  // Create placeholder tools file
  await writeFile(
    join(agentPath, 'tools', 'README.md'),
    `# ${config.name} Tools\n\nDocument agent-specific tools here.`
  );

  console.log(`✅ Agent created successfully at: ${agentPath}`);
  console.log(`\n📝 Next steps:`);
  console.log(`1. Edit ${agentPath}/agent.md to customize the agent`);
  console.log(`2. Add knowledge files to ${agentPath}/knowledge/`);
  console.log(`3. Document tools in ${agentPath}/tools/`);
  console.log(`4. Test the agent with: bun run test-agent ${config.slug}`);
}

// CLI Interface
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  console.log(`
🤖 Agent Creator

Usage: bun run create-agent [options]

Interactive mode:
  bun run create-agent

Quick mode:
  bun run create-agent --name "Agent Name" --slug "agent-slug" --description "Description"

Options:
  --name        Agent display name
  --slug        Agent directory name (lowercase-with-dashes)
  --description Brief description
  --role        Primary role
  --help        Show this help
  `);
  process.exit(0);
}

// Interactive mode
async function promptUser(question: string): Promise<string> {
  process.stdout.write(question);
  for await (const line of console) {
    return line.trim();
  }
  return '';
}

async function interactiveCreate() {
  console.log('🤖 Agent Creator - Interactive Mode\n');
  
  const name = await promptUser('Agent Name (e.g., "Tech News Curator"): ');
  const slug = await promptUser('Agent Slug (e.g., "tech-news-curator"): ');
  const description = await promptUser('Description: ');
  const role = await promptUser('Primary Role: ');
  
  const capabilitiesInput = await promptUser('Capabilities (comma-separated): ');
  const capabilities = capabilitiesInput.split(',').map(s => s.trim());
  
  const expertiseInput = await promptUser('Primary Expertise (comma-separated): ');
  const expertisePrimary = expertiseInput.split(',').map(s => s.trim());
  
  const tagsInput = await promptUser('Tags (comma-separated): ');
  const tags = tagsInput.split(',').map(s => s.trim());
  
  const languagesInput = await promptUser('Languages (comma-separated, default: English): ');
  const languages = languagesInput ? languagesInput.split(',').map(s => s.trim()) : ['English'];

  const config: AgentConfig = {
    name,
    slug,
    description,
    role,
    capabilities,
    expertise: {
      primary: expertisePrimary,
      secondary: []
    },
    tags,
    languages
  };

  await createAgent(config);
}

// Parse CLI args or run interactive
if (args.includes('--name')) {
  const nameIndex = args.indexOf('--name');
  const slugIndex = args.indexOf('--slug');
  const descIndex = args.indexOf('--description');
  const roleIndex = args.indexOf('--role');

  const config: AgentConfig = {
    name: args[nameIndex + 1],
    slug: args[slugIndex + 1],
    description: args[descIndex + 1],
    role: args[roleIndex + 1] || 'Specialist',
    capabilities: ['General assistance'],
    expertise: {
      primary: ['General knowledge'],
      secondary: []
    },
    tags: ['general'],
    languages: ['English']
  };

  await createAgent(config);
} else {
  await interactiveCreate();
}
