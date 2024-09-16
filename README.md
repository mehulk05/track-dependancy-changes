# Track-Dependency-Changes

A lightweight React utility that tracks the changes in component dependencies before and after each render. It also shows the number of times a component has re-rendered, and allows aliasing of dependency names for easier readability.

## Features

-   Track which dependencies in a component have changed before and after each render.
-   Display the number of times a component has re-rendered.
-   Alias dependency names for easier tracking and readability.
-   Print a detailed table showing:
    -   **Old Value**: The previous value of the dependency.
    -   **New Value**: The current value of the dependency.
    -   **Change**: Whether the dependency has changed (`✔️` or `❌`).

## Installation

Install the package via npm:


`npm install mk-track-dependancy-changes `

## Usage

Here’s how you can use the `useTrackDependency` hook in a React component to monitor changes in its dependencies:

### Example

tsx

```
import React, { useState, useEffect, useCallback } from "react";
import useTrackDependency from "mk-track-dependancy-changes"; // Import the hook

const ExampleComponent: React.FC = () => {
  // States to track
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");
  const [complexState, setComplexState] = useState({ name: "Alice", age: 25 });

  // A callback function (tracked)
  const handleClick = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  // Use the hook to track dependencies and render changes
  useTrackDependency(
    [count, text, complexState, handleClick], // Dependencies to track
    ["Count", "Text", "Complex State", "Handle Click"], // Labels for easier readability
    "ExampleComponent" // Component name (optional)
  );

  return (
    <div>
      <h1>useTrackDependency Example</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increase Count</button>

      <p>Text: {text}</p>
      <button onClick={() => setText(text === "Hello" ? "World" : "Hello")}>
        Toggle Text
      </button>

      <p>Complex State: {JSON.stringify(complexState)}</p>
      <button
        onClick={() =>
          setComplexState((prevState) => ({
            ...prevState,
            age: prevState.age + 1,
          }))
        }
      >
        Increase Age
      </button>
    </div>
  );
};

export default ExampleComponent;

```

### Explanation of the Hook

The `useTrackDependency` hook allows you to monitor state or prop changes in your component, as well as log useful debugging information to the console during each render.

#### Parameters:

1.  **`dependencies` (required):** An array of the dependencies (state, props, or functions) you want to track.
2.  **`labels` (optional):** An array of strings to alias your dependencies in the logs, making it easier to identify them.
3.  **`componentName` (optional):** A string representing the name of the component, to make console logs more identifiable.

### Console Output:

Whenever your component renders, the hook logs a table to the console showing:

-   **Old Value**: The value of the dependency before the render.
-   **New Value**: The value of the dependency after the render.
-   **Change**: A green tick (`✔️`) if the value has changed, or a red cross (`❌`) if it has not.

Each render will also be logged with the total number of renders of the component.

#### Example Console Log:

```
ExampleComponent Rendering 2 times
┌─────────┬────────────────────┬──────────┬───────────┬─────────┐
│ (index) │    Dependency      │ Old Value │ New Value │ Change │
├─────────┼────────────────────┼──────────┼───────────┼─────────┤
│    0    │       Count        │    0     │    1      │    ✔️   │
│    1    │       Text         │ "Hello"  │ "Hello"   │    ❌   │
│    2    │   Complex State    │ {name:…} │ {name:…}  │    ❌   │
│    3    │    Handle Click    │   func   │   func    │    ❌   │ 
└─────────┴────────────────────┴──────────┴───────────┴─────────┘
```

### Benefits:

-   **Debugging**: It helps identify which dependencies are causing re-renders and tracks the number of renders for better performance monitoring.
-   **Readability**: By allowing dependency aliasing, the logs become much clearer, especially in complex components.
-   **Flexible**: You can track any combination of state, props, or functions and see exactly when and why the component re-renders.

## License

This package is licensed under the MIT License. See the LICENSE file for details.

## Author

-   **Mehul Kothari**  
    GitHub: [https://github.com/mehulk05](https://github.com/mehulk05)  
    Email: mehulkothari05@gmail.com