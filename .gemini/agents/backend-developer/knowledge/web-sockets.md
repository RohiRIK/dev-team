# WebSockets

## What are WebSockets?
- **Persistent Connection**: A persistent, full-duplex communication channel over a single TCP connection.
- **Real-time Communication**: Enables real-time, bidirectional communication between a client and a server.

## How WebSockets Work
1. **Handshake**: The client sends an HTTP request to the server to initiate a WebSocket connection.
2. **Upgrade**: If the server supports WebSockets, it responds with an HTTP 101 Switching Protocols status, upgrading the connection.
3. **Data Transfer**: Once upgraded, data frames can be sent back and forth over the persistent connection.

## Benefits
- **Low Latency**: Reduced overhead compared to traditional HTTP polling.
- **Full-Duplex Communication**: Both client and server can send messages simultaneously.
- **Efficiency**: Less overhead per message after the initial handshake.

## Use Cases
- **Real-time Applications**: Chat applications, live dashboards, online gaming.
- **Notifications**: Instant notifications to users.
- **Collaborative Tools**: Shared whiteboards, document editing.

## Libraries and Frameworks
- **Node.js**: `ws`, Socket.IO
- **Python**: `websockets`, Flask-SocketIO
- **Java**: Spring WebSocket

## Security Considerations
- **Origin Validation**: Verify the `Origin` header to prevent cross-site WebSocket hijacking.
- **Input Validation**: Sanitize all incoming messages to prevent injection attacks.
- **Authentication and Authorization**: Secure WebSocket connections with proper authentication and authorization.
