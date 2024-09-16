import React, { useState, useCallback } from "react";
import useTrackDependency from "../hooks/useTrackDependency";


const ExampleComponent: React.FC = () => {
  // States to track
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");
  const [complexState, setComplexState] = useState({ name: "Alice", age: 25 });

  // A callback function (tracked)
  const handleClick = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  // Track the re-renders and state changes using useTrackDependency
  useTrackDependency(
    [count, text, complexState, handleClick], // Dependencies to track
    ["Count", "Text", "Complex State", "Handle Click"], // Labels for the dependencies
    "ExampleComponent" // Optional component name
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
