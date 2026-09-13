# React Concepts

## Fundamentals

| Concept | Description |
|---|---|
| **JSX** | A syntax extension that allows you to write HTML-like markup inside JavaScript, compiled to JavaScript function calls. |
| **Functional Components** | JavaScript functions that return React elements — the primary way to define components in modern React. |
| **Props** | Read-only data passed from a parent to a child component, used to customize behavior and appearance. |
| **State (useState)** | Mutable data managed within a component that triggers a re-render when updated. |
| **Event Handling** | Capturing and responding to user interactions like clicks, form submissions, and keyboard inputs. |
| **Conditional Rendering** | Displaying different UI based on state or props conditions. |
| **Lists and Keys** | Rendering multiple elements from an array with `map()`, using unique `key` props so React can track changes. |
| **useEffect Hook** | Performs side effects in functional components — data fetching, subscriptions, DOM updates. |
| **Context API (useContext)** | Passes data through the component tree without prop-drilling, useful for global state. |
| **useReducer** | Manages complex state logic with a reducer function; often paired with Context API for lightweight global state. |
| **Routing** | Navigating between pages or views using React Router. |
| **CSS Modules** | Scoped CSS styles per component, preventing class name collisions across the app. |

---

## Advanced

| Concept | Description |
|---|---|
| **Services and APIs** | Abstracting data-fetching logic into dedicated service modules, keeping components clean. |
| **Data Fetching** | Loading external data (e.g. from a REST API) asynchronously and managing loading/error states. |
