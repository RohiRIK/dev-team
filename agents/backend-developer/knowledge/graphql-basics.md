# GraphQL Basics

## What is GraphQL?
- **Query Language for APIs**: A query language for your API, and a runtime for fulfilling those queries with your existing data.
- **Client-Driven Data Fetching**: Clients can request exactly the data they need, no more, no less.

## Key Concepts
- **Schema**: Defines the types of data and operations available in the API.
- **Query**: Used to fetch data from the server.
- **Mutation**: Used to modify data on the server.
- **Subscription**: Used to receive real-time updates from the server.
- **Type System**: Strongly typed, allowing for data validation and introspection.

## Benefits
- **Efficient Data Fetching**: Avoids over-fetching and under-fetching data.
- **Single Endpoint**: All requests go to a single endpoint.
- **Strongly Typed**: Provides better data validation and developer experience.
- **Real-time Capabilities**: Subscriptions enable real-time data updates.

## Drawbacks
- **Complexity**: Can be more complex to set up than REST for simple APIs.
- **Caching**: Caching can be more challenging compared to REST.
- **File Uploads**: Handling file uploads can be more involved.

## Example Query
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

## Example Mutation
```graphql
mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    id
    name
  }
}
```
