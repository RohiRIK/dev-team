# Error Trigger Node Guide: Robust Error Handling in Workflows

**Author**: Manus AI

This document provides a comprehensive guide to the **Error Trigger node** in n8n, a specialized trigger node designed to initiate error handling workflows. It allows you to automatically respond to and manage failures in other workflows, enhancing the reliability and resilience of your n8n automations.

## 1. Overview and Purpose

The Error Trigger node is used to create dedicated error workflows. When a linked workflow fails, this node is triggered, receiving details about the failed workflow and the specific errors that occurred. This enables the creation of robust error handling mechanisms, such as sending notifications, logging errors, or attempting recovery actions, without cluttering the main workflow logic [1].

## 2. Usage

To implement an error workflow using the Error Trigger node:

1.  **Create a new workflow**: Start a new, independent workflow with the Error Trigger node as its first node. Give this workflow a descriptive name (e.g., "Error Handler") [1].
2.  **Link to main workflow**: In the workflow you want to protect, go to `Options > Settings`.
3.  **Select error workflow**: Under `Error workflow`, select the error handling workflow you just created (e.g., "Error Handler") [1].
4.  **Save**: Save the settings. Now, any errors in the main workflow will trigger the designated error workflow [1].

### 2.1. Important Considerations

*   **Activation**: Workflows using the Error Trigger node do not need to be activated manually; they are implicitly active when linked [1].
*   **Self-referencing**: If a workflow contains an Error Trigger node, it will, by default, use itself as its own error workflow [1].
*   **Testing**: Error workflows cannot be tested manually. The Error Trigger node only activates when an automatic workflow execution encounters an error [1].

## 3. Error Data Structure

When an error workflow is triggered, the Error Trigger node receives a JSON object containing detailed information about the failed execution. The default error data includes:

```json
[
  {
    "execution": {
      "id": "231",
      "url": "https://n8n.example.com/execution/231",
      "retryOf": "34",
      "error": {
        "message": "Example Error Message",
        "stack": "Stacktrace"
      },
      "lastNodeExecuted": "Node With Error",
      "mode": "manual"
    },
    "workflow": {
      "id": "1",
      "name": "Example Workflow"
    }
  }
]
```

**Note on data availability**:

*   `execution.id` and `execution.url` are not present if the error occurs in the trigger node of the main workflow, as the execution might not have been fully saved to the database yet [1].
*   `execution.retryOf` is only present if the execution is a retry of a previous failed execution [1].

### 3.1. Trigger Node Errors

If the error originates from the trigger node of the main workflow, the data structure is slightly different, with more information under a `trigger` object and less in `execution`:

```json
{
  "trigger": {
    "error": {
      "context": {},
      "name": "WorkflowActivationError",
      "cause": {
        "message": "",
        "stack": ""
      },
      "timestamp": 1654609328787,
      "message": "",
      "node": {
        . . . 
      }
    },
    "mode": "trigger"
  },
  "workflow": {
    "id": "",
    "name": ""
  }
}
```

## 4. Related Resources

For more advanced error handling, the [Stop And Error node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.stopanderror/) can be used to send custom messages to the Error Trigger node, allowing for more specific error reporting [1].

## 5. Common Use Cases

*   **Notification**: Sending email, Slack, or Microsoft Teams notifications to administrators when a critical workflow fails.
*   **Logging**: Recording error details in a database, log file, or monitoring system.
*   **Retry Mechanisms**: Implementing logic to automatically re-attempt a failed workflow after a delay.
*   **Data Recovery**: Saving partial data from a failed execution to prevent data loss.
*   **Alerting**: Triggering alerts in incident management systems.

## References

[1] https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.errortrigger/
