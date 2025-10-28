#!/bin/bash

echo "🧪 Testing Agent Context Hub MCP Server..."
echo ""

# Construct all JSON-RPC requests as a single stream
REQUESTS='{
"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_context","arguments":{"sessionId":"test-session-1"}}}
{
"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"store_context","arguments":{"sessionId":"test-session-1", "data": {"foo": "bar"}}}}
{
"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_context","arguments":{"sessionId":"test-session-1"}}}
{
"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"elicit_task_details","arguments":{"userInput":"Build a simple landing page"}}}
{
"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"elicit_task_details","arguments":{"userInput":"Design and implement a scalable microservices architecture with OAuth2 and integrate with existing legacy systems"}}}
{
"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"store_context","arguments":{"sessionId":"test-session-elicitation", "data": {}}}}
{
"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"record_task_outcome","arguments":{"outcome":{"sessionId":"test-session-elicitation","taskId":"task-1","agentName":"coder_agent","taskDescription":"Implement login feature","success":true,"durationMs":120000,"issues":[]}}}}
{
"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"record_task_outcome","arguments":{"outcome":{"sessionId":"test-session-elicitation","taskId":"task-2","agentName":"tester_agent","taskDescription":"Write unit tests for login","success":false,"durationMs":60000,"issues":["Bug found in login logic"]}}}}
{
"jsonrpc":"2.0","id":9,"method":"tools/call","params":{"name":"get_session_outcomes","arguments":{"sessionId":"test-session-elicitation"}}}
{
"jsonrpc":"2.0","id":10,"method":"tools/call","params":{"name":"analyze_task_performance","arguments":{"sessionId":"test-session-elicitation"}}}
{
"jsonrpc":"2.0","id":11,"method":"tools/call","params":{"name":"generate_recommendations","arguments":{"sessionId":"test-session-elicitation"}}}
{
"jsonrpc":"2.0","id":12,"method":"tools/call","params":{"name":"find_similar_past_tasks","arguments":{"taskDescription":"Implement login feature","limit":1}}}
'

echo "Sending requests to server and capturing output..."
SERVER_OUTPUT=$(echo "$REQUESTS" | node dist/index.js)

# Preprocess SERVER_OUTPUT to put each JSON object on a new line, then filter out notifications and extract results
RESULTS=$(echo "$SERVER_OUTPUT" | sed 's/} {/}\n{/g' | grep -v '"method":"notifications/message"' | jq -s '.')

# --- Assertions ---

# Test 1: Initial get_context should be null
echo "  Test 1: Initial get_context should be null"
INITIAL_CONTEXT=$(echo "$RESULTS" | jq '.[] | select(.id==1) | .result')
if [ "$INITIAL_CONTEXT" = "null" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected null, got $INITIAL_CONTEXT"
  exit 1
fi

# Test 2: store_context should return success: true
echo "  Test 2: store_context should return success: true"
STORE_CONTEXT_RESULT=$(echo "$RESULTS" | jq '.[] | select(.id==2) | .result.success')
if [ "$STORE_CONTEXT_RESULT" = "true" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected true, got $STORE_CONTEXT_RESULT"
  exit 1
fi

# Test 3: get_context after store should have data
echo "  Test 3: get_context after store should have data"
UPDATED_CONTEXT=$(echo "$RESULTS" | jq '.[] | select(.id==3) | .result.meta.foo')
if [ "$UPDATED_CONTEXT" = "\"bar\"" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected \"bar\", got $UPDATED_CONTEXT"
  exit 1
fi

# Test 4: elicit_task_details for simple task
echo "  Test 4: elicit_task_details for simple task"
SIMPLE_TASK_DETAILS_AGENT=$(echo "$RESULTS" | jq -r '.[] | select(.id==4) | .result.requiredAgents[] | select(.=="coder_agent")')
if [ "$SIMPLE_TASK_DETAILS_AGENT" = "coder_agent" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected coder_agent, got $SIMPLE_TASK_DETAILS_AGENT"
  exit 1
fi

# Test 5: elicit_task_details for complex task
echo "  Test 5: elicit_task_details for complex task"
COMPLEX_TASK_DETAILS_ARCHITECT=$(echo "$RESULTS" | jq -r '.[] | select(.id==5) | .result.requiredAgents[] | select(.=="architect_agent")')
COMPLEX_TASK_DETAILS_CODER=$(echo "$RESULTS" | jq -r '.[] | select(.id==5) | .result.requiredAgents[] | select(.=="coder_agent")')
if [ "$COMPLEX_TASK_DETAILS_ARCHITECT" = "architect_agent" ] && [ "$COMPLEX_TASK_DETAILS_CODER" = "coder_agent" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected architect_agent and coder_agent, got architect: $COMPLEX_TASK_DETAILS_ARCHITECT, coder: $COMPLEX_TASK_DETAILS_CODER"
  exit 1
fi

# Test 6: store_context for elicitation session (should return success: true)
echo "  Test 6: store_context for elicitation session"
ELICITATION_STORE_CONTEXT_RESULT=$(echo "$RESULTS" | jq '.[] | select(.id==6) | .result.success')
if [ "$ELICITATION_STORE_CONTEXT_RESULT" = "true" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected true, got $ELICITATION_STORE_CONTEXT_RESULT"
  exit 1
fi

# Test 7 & 8: record_task_outcome (no direct assertion, just ensure no error)
echo "  Test 7 & 8: record_task_outcome (no direct assertion, assuming no error)"
# We assume success if no error was returned by the server for these calls.
# A more robust test would check for error fields in the JSON-RPC response.
RECORD_OUTCOME_1_ERROR=$(echo "$RESULTS" | jq '.[] | select(.id==7) | .error')
RECORD_OUTCOME_2_ERROR=$(echo "$RESULTS" | jq '.[] | select(.id==8) | .error')
if [ "$RECORD_OUTCOME_1_ERROR" = "null" ] && [ "$RECORD_OUTCOME_2_ERROR" = "null" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Error recording task outcomes. Error 1: $RECORD_OUTCOME_1_ERROR, Error 2: $RECORD_OUTCOME_2_ERROR"
  exit 1
fi

# Test 9: get_session_outcomes should return 2 outcomes
echo "  Test 9: get_session_outcomes should return 2 outcomes"
SESSION_OUTCOMES_COUNT=$(echo "$RESULTS" | jq '.[] | select(.id==9) | .result | length')
if [ "$SESSION_OUTCOMES_COUNT" = "2" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected 2 outcomes, got $SESSION_OUTCOMES_COUNT"
  exit 1
fi

# Test 10: analyze_task_performance
echo "  Test 10: analyze_task_performance"
TOTAL_TASKS=$(echo "$RESULTS" | jq '.[] | select(.id==10) | .result.totalTasks')
SUCCESS_RATE=$(echo "$RESULTS" | jq '.[] | select(.id==10) | .result.successRate')
MOST_USED_AGENT=$(echo "$RESULTS" | jq -r '.[] | select(.id==10) | .result.mostUsedAgent')
if [ "$TOTAL_TASKS" = "2" ] && [ "$SUCCESS_RATE" = "0.5" ] && ([ "$MOST_USED_AGENT" = "coder_agent" ] || [ "$MOST_USED_AGENT" = "tester_agent" ]); then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected totalTasks=2, successRate=0.5, mostUsedAgent=coder_agent or tester_agent. Got totalTasks=$TOTAL_TASKS, successRate=$SUCCESS_RATE, mostUsedAgent=$MOST_USED_AGENT"
  exit 1
fi

# Test 11: generate_recommendations (should return at least one recommendation)
echo "  Test 11: generate_recommendations"
RECOMMENDATIONS_COUNT=$(echo "$RESULTS" | jq '.[] | select(.id==11) | .result | length')
if [ "$RECOMMENDATIONS_COUNT" -gt "0" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected at least one recommendation, got $RECOMMENDATIONS_COUNT"
  exit 1
fi

# Test 12: find_similar_past_tasks (should return 1 similar task)
echo "  Test 12: find_similar_past_tasks"
SIMILAR_TASKS_COUNT=$(echo "$RESULTS" | jq '.[] | select(.id==12) | .result | length')
SIMILAR_TASK_ID=$(echo "$RESULTS" | jq -r '.[] | select(.id==12) | .result[0].taskId')
if [ "$SIMILAR_TASKS_COUNT" = "1" ] && [ "$SIMILAR_TASK_ID" = "task-1" ]; then
  echo "    ✅ PASSED"
else
  echo "    ❌ FAILED: Expected 1 similar task with taskId \"task-1\". Got count=$SIMILAR_TASKS_COUNT, taskId=$SIMILAR_TASK_ID"
  exit 1
fi

echo ""
echo "✅ All tests passed!"
