import { useRef, useEffect } from "react";

// Enum for change tracking icons
enum ChangeStatusIcon {
  Changed = "✅",
  Unchanged = "❌",
}
const isObject = (element: any) => {
  return Object.prototype.toString.call(element) === "[object Object]";
};

function formatDependencyValue(dependencyItem: any) {
  if (isObject(dependencyItem) || Array.isArray(dependencyItem)) {
    let ans;
    try {
      ans = JSON.stringify(dependencyItem, null, 2);
    } catch (e) {
      ans = "CIRCULAR JSON";
    }
    return ans;
  }
  return dependencyItem;
}


function createChangeStatusEntry(
  current: any,
  previous: any,
  label: string,
  useFormatting: boolean
) {
  const oldValue = formatDependencyValue(previous);
  const newValue = formatDependencyValue(current);
  const oldValueWithoutFormatting = previous;
  const newValueWithoutFormatting = current;

  const isChanged = current !== previous;

  const entry = {
    "Dependency Name": label,
    "Old Value": isChanged
      ? (useFormatting ? oldValue : oldValueWithoutFormatting)
      : (useFormatting ? newValue : newValueWithoutFormatting),
    "New Value": isChanged
      ? (useFormatting ? newValue : newValueWithoutFormatting)
      : (useFormatting ? newValue : newValueWithoutFormatting),
    Changed: isChanged
      ? ChangeStatusIcon.Changed
      : ChangeStatusIcon.Unchanged,
  };

  return entry;
}

/**
 * Custom hook to track and log dependency changes in a React component.
 * @param dependencies Array of dependencies to track.
 * @param labels Optional array of labels for dependencies (for readability in logs).
 * @param componentName Optional component name for more informative logs.
 */
const useTrackDependency = (
  dependencies: any[],
  labels: string[] = [],
  componentName = "Component"
) => {
  const prevValuesRef = useRef<any[]>([]);
  const renderCountRef = useRef(0);

  const dependencyRef = useRef(dependencies);

  let isDependencyArr = Array.isArray(dependencyRef.current);

  useEffect(() => {
    if (!(dependencyRef.current && isDependencyArr)) {
      return;
    }


    renderCountRef.current += 1;
    const renderCount = renderCountRef.current;

    console.log(
      "%c///////////////////// Starting Dependency Change Tracking ///////////////////////",
      "background: #a6f2b7; color: #000; font-weight: bold; padding: 2px 5px;"
    );

    // Log the rendering information and changes to the console
    console.group(
      `${componentName} Rendering ${renderCount} ${
        renderCount === 1 ? "time" : "times"
      }`
    );


    const generateChangesSummaries = () => {
      const summaryWithFormatting: Record<number, object> = {};
      const summaryWithoutFormatting: Record<number, object> = {};

      dependencies.forEach((currentDep, index) => {
        const label = labels[index] || `Dependency ${index + 1}`;
        const previousDep = dependencyRef.current[index];

        // Create formatted entry
        summaryWithFormatting[index] = createChangeStatusEntry(
          currentDep,
          previousDep,
          label,
          true
        );

        // Create non-formatted entry
        summaryWithoutFormatting[index] = createChangeStatusEntry(
          currentDep,
          previousDep,
          label,
          false
        );

        // Update ref with the new value
        dependencyRef.current[index] = currentDep;
        // Update ref with the new value
        dependencyRef.current[index] = currentDep;
      });

      return {
        summaryWithFormatting,
        summaryWithoutFormatting,
      };
    };

    const { summaryWithFormatting, summaryWithoutFormatting } =
      generateChangesSummaries();

    console.table(summaryWithFormatting);
    console.dir(summaryWithoutFormatting, null);

    console.groupEnd();

    console.log(
      "%c//////////////////////////////////////////////////////////////////////////////",
      "background: #f49f5875; color: #000; font-weight: bold; padding: 2px 5px;"
    );
    // Update the ref with the current values
    prevValuesRef.current = dependencies.map((dep) =>
      isObject(dep) ? JSON.parse(JSON.stringify(dep)) : dep
    ); // Deep copy if it's an object
  }, [isDependencyArr, componentName, dependencies, labels]);
};

export default useTrackDependency;
