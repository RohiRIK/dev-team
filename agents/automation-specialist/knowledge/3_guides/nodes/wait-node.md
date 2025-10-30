# Wait Node Guide: Pausing Workflow Execution in n8n

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, Wait node, workflow pause, scheduled execution, webhook resume, form submission, rate limiting, asynchronous operations, workflow control

This document provides a comprehensive guide to the **Wait node** in n8n, a crucial component for introducing controlled pauses into your workflow execution. The Wait node allows you to temporarily halt a workflow until a specific condition is met, offloading execution data to the database and resuming when ready. This capability is essential for managing asynchronous processes, respecting rate limits, and incorporating human interaction points within automated workflows.

## 1. Overview and Purpose

The Wait node is specifically designed to pause a workflow's execution at a designated point. During this pause, the workflow's execution data is efficiently offloaded to the database, freeing up system resources. When the specified resume condition is met, the workflow reloads the data and seamlessly continues its execution from that exact point. This functionality is invaluable for scenarios requiring deliberate delays, external confirmations, or scheduled resumptions, enhancing workflow resilience and flexibility [1].

## 2. Operations (Resume Conditions)

The Wait node can resume based on several distinct conditions, offering versatile control over workflow timing:

### 2.1. After Time Interval

This option pauses the workflow for a precisely specified duration. You configure:

*   **Wait Amount**: The numerical quantity of time to wait.
*   **Wait Unit**: The unit of measure for the wait amount (e.g., Seconds, Minutes, Hours, Days) [1].

For wait times less than 65 seconds, the workflow's execution data is *not* offloaded; instead, the process continues to run in memory, and execution resumes after the interval. It's important to note that n8n server time is consistently used for all time-based operations, irrespective of any workflow-specific timezone settings [1].

### 2.2. At Specified Time

This option pauses the workflow until a particular date and time. You use a date and time picker to set the exact `Date and Time` for resumption. Similar to time intervals, the n8n server time dictates the point of resumption [1]. This is ideal for scheduling future actions.

### 2.3. On Webhook Call

This powerful feature allows the workflow to pause and resume upon receiving an HTTP call to a dynamically generated webhook URL. The `$execution.resumeUrl` variable provides this unique URL, which can be sent to external services or applications. Each execution generates a unique URL, enabling multiple Wait nodes in a workflow to resume sequentially without conflict [1].

Configuration options for webhook calls include:

*   **Authentication**: Define how incoming resume requests should be authenticated (e.g., Basic Auth, Header Auth, JWT Auth, None). Refer to the [Webhook node's authentication documentation](Node%20Reference/webhook-node-guide.md) for detailed guidance [1].
*   **HTTP Method**: Select the expected HTTP method (e.g., GET, POST) for the incoming webhook call.
*   **Response Code**: Specify the HTTP response code the webhook should return upon successful receipt.
*   **Respond**: Control when and how the webhook responds (e.g., `Immediately`, `When Last Node Finishes`, `Using 'Respond to Webhook' Node`).
*   **Limit Wait Time**: Optionally set a maximum wait duration for the webhook call. If the webhook is not received within this period, the workflow will automatically resume or proceed as configured [1].
*   **On Webhook Call options**: Further customize behavior, including `Binary Property` for binary data, `Ignore Bots`, `IP(s) Whitelist` for security, `No Response Body`, `Raw Body`, `Response Data`, `Response Headers`, and `Webhook Suffix` for unique URLs [1].

**Important Limitation**: Partial executions of your workflow can change the `$resumeWebhookUrl`. To ensure reliable resumption, confirm that the node responsible for sending this URL executes within the same execution context as the Wait node [1].

### 2.4. On Form Submitted

This option pauses the workflow until a user submits a form. The Wait node can generate a simple web form for user interaction, making it suitable for human-in-the-loop processes. Configuration includes:

*   **Form Title**: The title displayed at the top of the form.
*   **Form Description**: A descriptive text to guide the user.
*   **Form Fields**: Define each field to appear on the form, including `Field Label`, `Field Type` (e.g., Date, Dropdown List, Number, Password, Text, Textarea), and whether it's a `Required Field` [1].
*   **Respond When**: Control when to respond to the form submission (e.g., `Form Is Submitted`, `Workflow Finishes`, `Using 'Respond to Webhook' Node`).
*   **Limit Wait Time**: Similar to webhooks, you can set a maximum wait duration for form submission [1].
*   **On Form Response options**: Customize the response after submission (e.g., `Form Submitted Text`, `Redirect URL`, `Webhook Suffix`) [1].

## 3. Common Use Cases

The Wait node is highly versatile and applicable in numerous automation scenarios:

*   **Scheduled Tasks**: Pausing a workflow until a specific time or after a delay before performing a time-sensitive action (e.g., sending a reminder email at a future date).
*   **Human Approval Workflows**: Waiting for manual confirmation or input from a user via a web form or an external system (e.g., a manager approving a request) before continuing a critical process.
*   **API Rate Limiting**: Introducing controlled delays between API calls to avoid exceeding service rate limits and ensure stable integration with external platforms.
*   **Asynchronous Operations**: Waiting for an external system to complete a long-running task and signal its completion via a webhook, allowing n8n to resume processing only when necessary.
*   **Drip Campaigns**: Implementing delays between stages of a marketing or onboarding drip campaign.

## 4. Related Resources

For more details on time-based operations and webhook functionality, refer to the n8n documentation on [Time-based operations](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/#time-based-operations) and the [Webhook node](Node%20Reference/webhook-node-guide.md) [1]. These resources provide additional context and examples for effectively utilizing the Wait node.

## References

[1] n8n Documentation: Wait Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/)

