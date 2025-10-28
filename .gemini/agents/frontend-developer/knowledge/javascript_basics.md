# JavaScript Basics for Frontend Developers

JavaScript is the cornerstone of modern frontend development, enabling interactive and dynamic web experiences. Here are the fundamental concepts every frontend developer should master.

## 1. Variables and Data Types

-   **Variables:** Used to store data. Declared using `var`, `let`, or `const`.
    -   `var`: Function-scoped, can be re-declared and re-assigned. (Generally avoided in modern JS).
    -   `let`: Block-scoped, can be re-assigned but not re-declared.
    -   `const`: Block-scoped, cannot be re-assigned or re-declared. (Preferred for values that don't change).
-   **Data Types:**
    -   **Primitive:** `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.
    -   **Non-primitive (Object):** `object` (including arrays and functions).

## 2. Operators

-   **Arithmetic:** `+`, `-`, `*`, `/`, `%` (modulo), `**` (exponentiation).
-   **Assignment:** `=`, `+=`, `-=`, etc.
-   **Comparison:** `==` (loose equality), `===` (strict equality), `!=`, `!==`, `>`, `<`, `>=`, `<=`.
-   **Logical:** `&&` (AND), `||` (OR), `!` (NOT).
-   **Ternary (Conditional):** `condition ? exprIfTrue : exprIfFalse`.

## 3. Control Flow

-   **Conditional Statements:**
    -   `if...else if...else`: Executes different blocks of code based on conditions.
    -   `switch`: Evaluates an expression and executes code based on matching `case` values.
-   **Loops:**
    -   `for`: Repeats a block of code a specified number of times.
    -   `while`: Repeats a block of code as long as a condition is true.
    -   `do...while`: Similar to `while`, but guarantees at least one execution.
    -   `for...in`: Iterates over enumerable properties of an object.
    -   `for...of`: Iterates over iterable objects (arrays, strings, maps, sets, etc.).

## 4. Functions

-   **Definition:** Reusable blocks of code that perform a specific task.
-   **Declaration:** `function myFunction(param1, param2) { /* code */ }`
-   **Expression:** `const myFunction = function(param1, param2) { /* code */ };`
-   **Arrow Functions (ES6+):** Concise syntax, lexical `this` binding. `const myFunction = (param1, param2) => { /* code */ };`
-   **Parameters and Arguments:** Values passed into and received by functions.
-   **Return Values:** Functions can return a value using the `return` keyword.

## 5. Objects

-   **Definition:** Collections of key-value pairs.
-   **Creation:**
    -   Object literal: `const person = { name: 'Alice', age: 30 };`
    -   Constructor function: `function Person(name) { this.name = name; } const person = new Person('Bob');`
    -   Class (ES6+): `class Person { constructor(name) { this.name = name; } } const person = new Person('Charlie');`
-   **Accessing Properties:** Dot notation (`person.name`) or bracket notation (`person['name']`).

## 6. Arrays

-   **Definition:** Ordered collections of values.
-   **Creation:** `const fruits = ['apple', 'banana', 'cherry'];`
-   **Accessing Elements:** Using index (`fruits[0]`).
-   **Common Methods:** `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `slice()`, `forEach()`, `map()`, `filter()`, `reduce()`, `find()`, `findIndex()`.

## 7. Scope and Closures

-   **Scope:** Determines the accessibility of variables.
    -   **Global Scope:** Variables accessible everywhere.
    -   **Function Scope:** Variables accessible only within the function they are declared in (for `var`).
    -   **Block Scope:** Variables accessible only within the block (`{}`) they are declared in (for `let` and `const`).
-   **Closures:** A function "remembers" its lexical environment (the scope in which it was declared), even when executed outside that scope. This allows functions to access variables from their outer function after the outer function has finished executing.

## 8. The `this` Keyword

-   **Context:** Refers to the object that is currently executing the code. Its value depends on *how* a function is called.
    -   **Global Context:** `this` refers to the global object (`window` in browsers).
    -   **Method Call:** `this` refers to the object the method belongs to.
    -   **Constructor Call:** `this` refers to the new instance being created.
    -   **Event Handler:** `this` often refers to the element that triggered the event.
    -   **Arrow Functions:** Lexically bind `this` (inherit `this` from their parent scope).

## 9. DOM Manipulation

-   **Document Object Model (DOM):** A programming interface for web documents. It represents the page structure as a tree of objects.
-   **Selecting Elements:**
    -   `document.getElementById('id')`
    -   `document.querySelector('.class')`, `document.querySelector('#id')`, `document.querySelector('tag')`
    -   `document.querySelectorAll('.class')` (returns a NodeList)
    -   `document.getElementsByClassName('class')`
    -   `document.getElementsByTagName('tag')`
-   **Modifying Elements:**
    -   `element.innerHTML`, `element.textContent`
    -   `element.setAttribute('attribute', 'value')`
    -   `element.classList.add('class')`, `element.classList.remove('class')`, `element.classList.toggle('class')`
    -   `element.style.property = 'value'`
-   **Creating/Removing Elements:**
    -   `document.createElement('tag')`
    -   `parentNode.appendChild(childNode)`
    -   `parentNode.removeChild(childNode)`

## 10. Event Handling

-   **Events:** Actions that happen in the browser (e.g., click, hover, keypress, load, submit).
-   **Event Listeners:** Functions that "listen" for specific events on elements.
    -   `element.addEventListener('event', handlerFunction)`
    -   `element.removeEventListener('event', handlerFunction)`
-   **Event Object:** An object passed to the event handler containing information about the event.
    -   `event.target`: The element that triggered the event.
    -   `event.preventDefault()`: Stops the default action of an event (e.g., form submission).
    -   `event.stopPropagation()`: Stops the event from bubbling up the DOM tree.

## 11. Asynchronous JavaScript

-   **Definition:** Operations that don't block the main thread of execution, allowing the browser to remain responsive. Essential for network requests (fetching data).
-   **Callbacks:** Functions passed as arguments to other functions, to be executed later. (Can lead to "callback hell").
-   **Promises (ES6+):** Objects representing the eventual completion or failure of an asynchronous operation.
    -   `new Promise((resolve, reject) => { /* async code */ })`
    -   `.then()`: Handles successful resolution.
    -   `.catch()`: Handles errors.
    -   `.finally()`: Executes regardless of success or failure.
-   **Async/Await (ES8+):** Syntactic sugar built on Promises, making asynchronous code look and behave more like synchronous code.
    -   `async function fetchData() { /* ... */ }`
    -   `const data = await somePromiseFunction();`

## 12. ES6+ Features (Modern JavaScript)

Beyond what's already mentioned (arrow functions, `let`/`const`, classes, Promises, async/await), other key features include:

-   **Template Literals:** Backticks (`` ` ``) for string interpolation and multi-line strings.
-   **Destructuring Assignment:** Extracting values from arrays or properties from objects into distinct variables.
-   **Spread/Rest Operators (`...`):**
    -   **Spread:** Expands iterables (arrays, strings) into individual elements; copies arrays/objects.
    -   **Rest:** Gathers multiple elements into an array.
-   **Modules (import/export):** Organizing code into separate files for better maintainability and reusability.
