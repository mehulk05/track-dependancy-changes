
import { useRef, useEffect } from "react";

// Define the green tick icon as a string of Unicode
const GreenTickIcon = "✔️"; // Unicode green tick icon
const RedCrossIcon = '❌';  // Unicode red cross icon

const deepEqual = (a: any, b: any) => {
    // Implement deep equality check (you might use a library like lodash for this)
    return JSON.stringify(a) === JSON.stringify(b);
  };

const getFunctionName = (func: (...args: any[]) => void): string => {
  if (func?.name) {
    return func.name;
  }
  return "Anonymous Function";
};

const useTrackDependency = (dependencies: any[], labels: string[] = [],  componentName = 'Component') => {
  const prevValuesRef = useRef<any[]>([]);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    const renderCount = renderCountRef.current;

    const prevValues = prevValuesRef.current;
    const changes = dependencies.map((dep, index) => {
      let displayValue = "";
      if (typeof dep === "function") {
        displayValue = getFunctionName(dep);
      } else {
        displayValue = dep;
      }

      return {
        name: labels[index] || `Dependency ${index + 1}`,
        oldValue: prevValues[index],
        newValue: displayValue,
        hasChanged: !deepEqual(prevValues[index], displayValue),
      };
    });

    // Log the rendering information and changes to the console
    console.group(`${componentName} Rendering ${renderCount} ${renderCount === 1 ? 'time' : 'times'}`);


    console.table(
      changes.map(({ name, oldValue, newValue, hasChanged }) => ({
        Dependency: name,
        "Old Value": oldValue,
        "New Value": newValue,
        Change: hasChanged ? GreenTickIcon : RedCrossIcon,
      }))
    );
    console.groupEnd();

    // Update the ref with the current values
    prevValuesRef.current = dependencies;
  }, [componentName, dependencies, labels]);
};

export default useTrackDependency;