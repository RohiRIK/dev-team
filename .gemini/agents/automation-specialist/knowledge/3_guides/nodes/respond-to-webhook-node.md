# Respond to Webhook Node Guide: Customizing Webhook Responses in n8n

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, Respond to Webhook node, webhook response, custom API, HTTP response, headers, status code, JSON, binary file, redirect, streaming, security

This document provides a comprehensive guide to the **Respond to Webhook node** in n8n, a specialized node designed to control and customize the response sent back to an incoming webhook request. This node works in conjunction with the [Webhook trigger node](Node%20Reference/webhook-node-guide.md), allowing for dynamic and tailored responses to external services, effectively transforming n8n workflows into custom API endpoints.

## 1. Overview and Purpose

The Respond to Webhook node is used to define the HTTP response that an n8n workflow sends back to the service that initiated it via a [Webhook node](Node%20Reference/webhook-node-guide.md). It provides granular control over the response body, headers, and status code, making it invaluable for building robust API endpoints or providing specific feedback to integrated applications [1].

### 1.1. How to Implement

To effectively utilize the Respond to Webhook node:

1.  **Start with a Webhook node**: The workflow must begin with a [Webhook trigger node](Node%20Reference/webhook-node-guide.md).
2.  **Configure Webhook node**: In the [Webhook node](Node%20Reference/webhook-node-guide.md), set the `Respond` parameter to `Using 'Respond to Webhook' Node`. This delegates the response generation to the Respond to Webhook node [1].
3.  **Place Respond to Webhook node**: Add the Respond to Webhook node anywhere in your workflow. For it to return data from other nodes, ensure it is placed after those nodes that generate the desired output [1].

## 2. Node Parameters: Defining the Response Content

### 2.1. Respond With

This parameter determines the content and format of the data sent in the webhook response. Options include:

*   **All Incoming Items**: Responds with all JSON items received by the node from its input, typically formatted as a JSON array.
*   **Binary File**: Responds with a binary file. The specific file is identified via the `Response Data Source` field.
*   **First Incoming Item**: Responds with the JSON of only the first incoming item, useful when a single, consolidated response is needed.
*   **JSON**: Responds with a custom JSON object, which you define directly in the `Response Body` field.
*   **JWT Token**: Responds with a JSON Web Token, suitable for authentication and authorization flows.
*   **No Data**: Sends a response with an empty payload, often used for acknowledgment or when the client does not expect data.
*   **Redirect**: Redirects the client to a specified `Redirect URL`, useful for post-submission actions or external links.
*   **Text**: Responds with plain text, defined in the `Response Body`. By default, this sends HTML (`Content-Type: text/html`) [1].

## 3. Node Options: Customizing Response Behavior

Additional options provide further customization for the response:

*   **Response Code**: Set the HTTP status code for the response (e.g., `200 OK` for success, `400 Bad Request` for client errors, `500 Internal Server Error` for server errors) [1].
*   **Response Headers**: Define custom HTTP headers to be included in the response. This allows for setting caching policies, content types, or custom metadata [1].
*   **Put Response in Field**: Available when responding with `All Incoming Items` or `First Incoming Item`. This allows you to specify a field name where the response data will be placed in the node's output, enabling further processing of the response within the workflow [1].
*   **Enable Streaming**: When enabled, data is sent back to the user using streaming. This requires the triggering [Webhook node](Node%20Reference/webhook-node-guide.md) to also be configured with the `Response mode Streaming`, which is beneficial for real-time applications like AI chatbots [1].

## 4. Workflow Behavior and Considerations

*   **Single Execution**: The Respond to Webhook node processes only the first incoming data item. If a workflow contains multiple Respond to Webhook nodes, only the first one executed will be considered for the response; subsequent ones will be ignored [1].
*   **Error Handling**: If the workflow encounters an error before a Respond to Webhook node executes, a `500 Internal Server Error` status is returned to the client. If no [Webhook node](Node%20Reference/webhook-node-guide.md) was present to trigger the workflow, the Respond to Webhook node is ignored [1].
*   **Output Branch**: By default, the node has a single output branch containing its input data. You can enable a secondary output branch (in the node's `Settings` tab) to also output the response sent to the webhook, allowing for internal logging or auditing of the generated response [1].

### 4.1. Returning Multiple Data Items (Historical Context)

Prior to n8n version 1.22.0, returning multiple data items with the Respond to Webhook node was more challenging. With the introduction of the `All Incoming Items` option in version 1.22.0, workarounds are largely unnecessary. For older versions, alternatives included configuring the [Webhook node](Node%20Reference/webhook-node-guide.md) with `When Last Node Finishes` or aggregating multiple items into a single item using the [Aggregate node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.aggregate/) before passing them to the Respond to Webhook node [1].

## 5. Security Considerations for HTML Responses

Similar to the [Webhook node](Node%20Reference/webhook-node-guide.md), starting with n8n version 1.103.0, HTML responses generated by the Respond to Webhook node are automatically wrapped in `<iframe>` tags for enhanced security. This sandboxing mechanism prevents direct access to the parent document and can impact JavaScript code that relies on top-level window access or local storage. It also necessitates the use of absolute URLs instead of relative ones within such responses [1]. Developers should be aware of these implications when designing interactive webhook responses.

## 6. Common Use Cases

The Respond to Webhook node is highly versatile for creating interactive and responsive automations:

*   **Custom API Responses**: Building API endpoints that return specific data structures (JSON, XML) or files based on workflow logic.
*   **Interactive Forms**: Providing custom success messages, error feedback, or redirects after a form submission, enhancing user experience.
*   **Chatbot Integration**: Sending structured responses back to a chatbot platform based on complex workflow processing, enabling dynamic conversational flows.
*   **Asynchronous Task Status**: Returning a `202 Accepted` status immediately for long-running tasks, along with a mechanism (e.g., a URL) for the client to poll for completion, managing asynchronous operations efficiently.
*   **Dynamic Content Delivery**: Serving dynamic HTML or other content based on real-time data and workflow logic.

## References

[1] n8n Documentation: Respond to Webhook Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/)

