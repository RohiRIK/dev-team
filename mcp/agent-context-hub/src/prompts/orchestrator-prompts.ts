// Additional prompt templates and patterns

export const ORCHESTRATION_PATTERNS = {
  sequential: {
    name: 'Sequential Execution',
    description: 'Execute agents one after another using dependencies',
    example: `
// Create chain: architect → coder → tester
create_agent_task({ agentName: "architect_agent", dependencies: [] })
create_agent_task({ agentName: "coder_agent", dependencies: ["task_1"] })
create_agent_task({ agentName: "tester_agent", dependencies: ["task_2"] })
    `,
  },
  parallel: {
    name: 'Parallel Execution',
    description: 'Execute multiple agents simultaneously',
    example: `
// Both can run at same time (no dependencies)
create_agent_task({ agentName: "coder_agent_api", dependencies: [] })
create_agent_task({ agentName: "coder_agent_ui", dependencies: [] })
    `,
  },
  pipeline: {
    name: 'Pipeline Pattern',
    description: 'Chain agents where each output feeds the next input',
    example: `
// Each agent reads previous output from context
1. architect_agent stores "api_spec"
2. coder_agent reads "api_spec", stores "code"
3. tester_agent reads "code", stores "test_results"
    `,
  },
  fanout_fanin: {
    name: 'Fan-Out/Fan-In',
    description: 'Split work across agents, then merge results',
    example: `
// Fan-out: Multiple agents work in parallel
create_agent_task({ agentName: "coder_1", dependencies: ["design"] })
create_agent_task({ agentName: "coder_2", dependencies: ["design"] })

// Fan-in: Aggregator waits for all
create_agent_task({ 
  agentName: "merger", 
  dependencies: ["coder_1", "coder_2"] 
})
    `,
  },
};
