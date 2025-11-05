import { listWorkflows, getWorkflow } from './index.js';

async function main() {
  const workflows = await listWorkflows();
  console.log('Available workflows:', workflows.map(w => w.id));
  if (workflows.length > 0) {
    const wf = await getWorkflow(workflows[0].id);
    console.log(`First workflow details (${workflows[0].id}):`, JSON.stringify(wf, null, 2));
  } else {
    console.log('No workflows found.');
  }
}

main().catch(console.error);
