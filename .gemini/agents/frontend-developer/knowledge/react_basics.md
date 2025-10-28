# React Basics for Frontend Developers

React is a declarative, component-based JavaScript library for building user interfaces, primarily for single-page applications. It allows developers to create large web applications that can change data without reloading the page.

## 1. Components

React applications are built from isolated, reusable pieces of code called components. Components can be thought of as custom HTML elements. There are two main types of components:

-   **Functional Components**: These are JavaScript functions that accept props (properties) as an argument and return React elements. With the introduction of Hooks, functional components are now the preferred way to write React components as they can manage state and side effects.
    ```jsx
    function Welcome(props) {
      return <h1>Hello, {props.name}</h1>;
    }
    ```
-   **Class Components**: These are ES6 classes that extend `React.Component` and have a `render()` method that returns React elements. They can also hold local state and lifecycle methods. While still supported, they are less common in new React development.
    ```jsx
    class Welcome extends React.Component {
      render() {
        return <h1>Hello, {this.props.name}</h1>;
      }
    }
    ```

## 2. JSX (JavaScript XML)

JSX is a syntax extension for JavaScript that allows you to write HTML-like code directly within your JavaScript files. It's not mandatory to use JSX, but it makes writing React components much more intuitive and readable.

-   **Embedding Expressions**: You can embed any valid JavaScript expression inside JSX by wrapping it in curly braces `{}`.
    ```jsx
    const name = 'Sara';
    const element = <h1>Hello, {name}</h1>;
    ```
-   **Attributes**: JSX attributes are written in camelCase (e.g., `className` instead of `class`, `htmlFor` instead of `for`).
    ```jsx
    <img src={user.avatarUrl} alt="Avatar" className="user-avatar" />
    ```

## 3. Props (Properties)

Props are read-only inputs to components. They allow you to pass data from a parent component to a child component. Components should never modify their own props.

```jsx
// Parent Component
function App() {
  return <Welcome name="Alice" />;
}

// Child Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>; // props.name is "Alice"
}
```

## 4. State

State is data that a component manages internally and can change over time. When the state changes, the component re-renders. In functional components, you manage state using the `useState` Hook.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // count is the state variable, setCount is the updater function

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## 5. Event Handling

React events are named using camelCase (e.g., `onClick`, `onChange`). You pass a function as the event handler.

```jsx
function MyButton() {
  function handleClick() {
    alert('Button clicked!');
  }

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

## 6. Conditional Rendering

You can render different elements or components based on certain conditions using JavaScript operators like `if` statements, logical `&&` operator, or the ternary operator.

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign up.</h1>;
}

// Using ternary operator
function UserStatus(props) {
  return (
    <div>
      {props.isLoggedIn ? <p>Logged In</p> : <p>Logged Out</p>}
    </div>
  );
}
```

## 7. Lists and Keys

When rendering lists of elements, React requires a unique `key` prop for each item. Keys help React identify which items have changed, are added, or are removed, improving performance and preventing issues.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}> {/* Key should be unique among siblings */}
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
// <NumberList numbers={numbers} />
```

## 8. Hooks (useState, useEffect)

Hooks are functions that let you "hook into" React state and lifecycle features from functional components.

-   **`useState`**: Allows functional components to manage state.
-   **`useEffect`**: Allows functional components to perform side effects (e.g., data fetching, subscriptions, manually changing the DOM) after rendering. It runs after every render by default, but you can control when it runs by providing a dependency array.

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This runs after every render
    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    // Cleanup function: runs when the component unmounts or before the effect re-runs
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only once after the initial render
           // and cleans up when the component unmounts.

  return <p>Timer: {count} seconds</p>;
}
```

## React Development Workflow

Typically, you'd start a React project using a tool like Create React App or Vite, which sets up a development environment with a build pipeline (Webpack/Rollup, Babel) to compile JSX and modern JavaScript into browser-compatible code.

```bash
# Using Create React App
npx create-react-app my-app
cd my-app
npm start

# Using Vite
npm create vite@latest my-vite-app -- --template react
cd my-vite-app
npm install
npm run dev
```
