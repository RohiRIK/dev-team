"""# HTTP Request Node Guide: Connecting to Any REST API

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, HTTP Request node, REST API, API integration, web services, authentication, HTTP methods, data transfer, JSON, cURL, pagination, error handling

This document provides a comprehensive guide to the **HTTP Request node** in n8n, one of the most versatile and powerful nodes for external integrations. It enables interaction with any application or service exposing a REST API, facilitating data querying, information submission, and automation of a wide array of tasks.

## 1. Overview and Core Functionality

The HTTP Request node is the primary mechanism for making REST API calls within an n8n workflow. It can function as a standard node to fetch or push data, or as a tool for an AI agent to interact with external services. Effective utilization necessitates a foundational understanding of API terminology and concepts, including HTTP methods, headers, and request bodies [1].

There are two principal methods for configuring an HTTP request within this node:

*   **Node Parameters**: Manually configure the request by specifying the URL, method, authentication details, and other relevant parameters directly within the node's settings.
*   **Import cURL Command**: A streamlined approach involves importing a cURL command, which n8n automatically parses to configure the node's parameters, simplifying complex setups.

## 2. Key Node Parameters

### 2.1. HTTP Method and URL

*   **Method**: Select the appropriate HTTP method for your intended operation. Common methods include `GET` (to retrieve data), `POST` (to create data), `PUT` (to update data), and `DELETE` (to remove data). Additional methods such as `PATCH`, `HEAD`, and `OPTIONS` are also supported.
*   **URL**: Specify the target API endpoint to which the request will be sent.

### 2.2. Authentication Mechanisms

n8n offers diverse approaches to handle API authentication, ensuring secure communication:

*   **Predefined Credentials**: This is the recommended method for services with dedicated n8n integrations, simplifying credential setup and management.
*   **Generic Credentials**: For services lacking a predefined n8n integration, authentication can be configured manually. Supported generic authentication methods include:
    *   Basic Auth
    *   Header Auth
    *   OAuth1 and OAuth2
    *   Query Auth
    *   Digest Auth
    *   Custom Auth

For detailed guidance on setting up each authentication type, refer to the official [HTTP Request credentials documentation](https://docs.n8n.io/credentials/http-request/) [1].

### 2.3. Data Transmission (Query Parameters, Headers, Body)

*   **Send Query Parameters**: Used to filter or specify the data being requested. Query parameters can be defined as key-value pairs or as a JSON object, appended to the URL.
*   **Send Headers**: Headers provide additional context or metadata for your request (e.g., `Content-Type`, `Authorization`). Similar to query parameters, they can be defined as key-value pairs or as a JSON object.
*   **Send Body**: For HTTP methods like `POST`, `PUT`, or `PATCH`, a request body is often required to transmit data. The HTTP Request node supports various body content types:
    *   **Form URLencoded**: Sends data as `application/x-www-form-urlencoded`.
    *   **Form-Data**: Transmits data as `multipart/form-data`, commonly used for file uploads.
    *   **JSON**: Sends a JSON object as the request body.
    *   **n8n Binary File**: Sends the content of a file stored within n8n as the request body.
    *   **Raw**: Allows for sending raw data with a custom `Content-Type` header.

## 3. Advanced Node Options

The HTTP Request node provides several advanced options to fine-tune its operational behavior:

*   **Array Format in Query Parameters**: Controls the formatting of arrays within the query string (e.g., with or without brackets).
*   **Batching**: Processes a large number of input items in smaller batches, with a configurable interval between each batch. This is particularly useful for adhering to API rate limits.
*   **Ignore SSL Issues**: By default, n8n validates SSL certificates. This option can disable validation for development or testing, though it is not recommended for production environments due to security implications.
*   **Redirects**: Configures whether the node should follow HTTP redirects and allows setting a maximum number of redirects to pursue.
*   **Response Handling**: Customizes how the node processes the API response, including:
    *   **Include Response Headers and Status**: Returns the complete response, encompassing headers and the status code, in addition to the body.
    *   **Never Error**: Prevents the node from failing the workflow, even if the API returns an error status code (e.g., 4xx or 5xx).
    *   **Response Format**: Specifies the expected format of the returned data (e.g., JSON, Text, File).
*   **Pagination**: Automatically handles paginated API responses to retrieve all results from an endpoint. Pagination can be configured based on a next-page URL provided in the response or by iteratively updating a parameter in successive requests.
*   **Proxy**: Routes the HTTP request through a specified proxy server.
*   **Timeout**: Sets a maximum duration for the request to prevent the workflow from indefinitely waiting for a response.

## 4. Common Issues and Troubleshooting

For troubleshooting common problems associated with the HTTP Request node, such as authentication errors, unexpected responses, or connectivity issues, refer to the [Common Issues section](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/#common-issues) of the official n8n documentation [1].

## References

[1] n8n Documentation: HTTP Request Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
"""
