import { useRef, useEffect } from "react";
// Enum for change tracking icons
var ChangeStatusIcon;
(function (ChangeStatusIcon) {
    ChangeStatusIcon["Changed"] = "\u2705";
    ChangeStatusIcon["Unchanged"] = "\u274C";
})(ChangeStatusIcon || (ChangeStatusIcon = {}));
var isObject = function (element) {
    return Object.prototype.toString.call(element) === "[object Object]";
};
function formatDependencyValue(dependencyItem) {
    if (isObject(dependencyItem) || Array.isArray(dependencyItem)) {
        var ans = void 0;
        try {
            ans = JSON.stringify(dependencyItem, null, 2);
        }
        catch (e) {
            ans = "CIRCULAR JSON";
        }
        return ans;
    }
    return dependencyItem;
}
function createChangeStatusEntry(current, previous, label, useFormatting) {
    var oldValue = formatDependencyValue(previous);
    var newValue = formatDependencyValue(current);
    var oldValueWithoutFormatting = previous;
    var newValueWithoutFormatting = current;
    var isChanged = current !== previous;
    var entry = {
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
var useTrackDependency = function (dependencies, labels, componentName) {
    if (labels === void 0) { labels = []; }
    if (componentName === void 0) { componentName = "Component"; }
    var prevValuesRef = useRef([]);
    var renderCountRef = useRef(0);
    var dependencyRef = useRef(dependencies);
    var isDependencyArr = Array.isArray(dependencyRef.current);
    useEffect(function () {
        if (!(dependencyRef.current && isDependencyArr)) {
            return;
        }
        renderCountRef.current += 1;
        var renderCount = renderCountRef.current;
        console.log("%c///////////////////// Starting Dependency Change Tracking ///////////////////////", "background: #a6f2b7; color: #000; font-weight: bold; padding: 2px 5px;");
        // Log the rendering information and changes to the console
        console.group("".concat(componentName, " Rendering ").concat(renderCount, " ").concat(renderCount === 1 ? "time" : "times"));
        var generateChangesSummaries = function () {
            var summaryWithFormatting = {};
            var summaryWithoutFormatting = {};
            dependencies.forEach(function (currentDep, index) {
                var label = labels[index] || "Dependency ".concat(index + 1);
                var previousDep = dependencyRef.current[index];
                // Create formatted entry
                summaryWithFormatting[index] = createChangeStatusEntry(currentDep, previousDep, label, true);
                // Create non-formatted entry
                summaryWithoutFormatting[index] = createChangeStatusEntry(currentDep, previousDep, label, false);
                // Update ref with the new value
                dependencyRef.current[index] = currentDep;
                // Update ref with the new value
                dependencyRef.current[index] = currentDep;
            });
            return {
                summaryWithFormatting: summaryWithFormatting,
                summaryWithoutFormatting: summaryWithoutFormatting,
            };
        };
        var _a = generateChangesSummaries(), summaryWithFormatting = _a.summaryWithFormatting, summaryWithoutFormatting = _a.summaryWithoutFormatting;
        console.table(summaryWithFormatting);
        console.dir(summaryWithoutFormatting, null);
        console.groupEnd();
        console.log("%c//////////////////////////////////////////////////////////////////////////////", "background: #f49f5875; color: #000; font-weight: bold; padding: 2px 5px;");
        // Update the ref with the current values
        prevValuesRef.current = dependencies.map(function (dep) {
            return isObject(dep) ? JSON.parse(JSON.stringify(dep)) : dep;
        }); // Deep copy if it's an object
    }, [isDependencyArr, componentName, dependencies, labels]);
};
export default useTrackDependency;
