/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
// Define the green tick icon as a string of Unicode
var GreenTickIcon = "✔️"; // Unicode green tick icon
var RedCrossIcon = '❌'; // Unicode red cross icon
var isObject = function (element) {
    return Object.prototype.toString.call(element) === '[object Object]';
};
var deepEqual = function (a, b) {
    // Implement deep equality check (you might use a library like lodash for this)
    return JSON.stringify(a) === JSON.stringify(b);
};
function getStringifyInfo(dependencyItem) {
    /**
     * Printing the info into viewable format
     */
    if (isObject(dependencyItem) || Array.isArray(dependencyItem)) {
        var ans = void 0;
        try {
            ans = JSON.stringify(dependencyItem, null, 2);
        }
        catch (e) {
            ans = 'CIRCULAR JSON';
        }
        return ans;
    }
    return dependencyItem;
}
var getFunctionName = function (func) {
    if (func === null || func === void 0 ? void 0 : func.name) {
        return func.name;
    }
    return "Anonymous Function";
};
var useTrackDependency = function (dependencies, labels, componentName) {
    if (labels === void 0) { labels = []; }
    if (componentName === void 0) { componentName = 'Component'; }
    var prevValuesRef = useRef([]);
    var renderCountRef = useRef(0);
    useEffect(function () {
        renderCountRef.current += 1;
        var renderCount = renderCountRef.current;
        var prevValues = prevValuesRef.current;
        var changes = dependencies.map(function (dep, index) {
            var displayValue = "";
            if (typeof dep === "function") {
                displayValue = getFunctionName(dep);
            }
            else {
                displayValue = dep;
            }
            return {
                name: labels[index] || "Dependency ".concat(index + 1),
                oldValue: prevValues[index],
                newValue: displayValue,
                hasChanged: !deepEqual(prevValues[index], displayValue),
            };
        });
        // Log the rendering information and changes to the console
        console.group("".concat(componentName, " Rendering ").concat(renderCount, " ").concat(renderCount === 1 ? 'time' : 'times'));
        console.table(changes.map(function (_a) {
            var name = _a.name, oldValue = _a.oldValue, newValue = _a.newValue, hasChanged = _a.hasChanged;
            return ({
                Dependency: name,
                "Old Value": getStringifyInfo(oldValue),
                "New Value": getStringifyInfo(newValue),
                Change: hasChanged ? GreenTickIcon : RedCrossIcon,
            });
        }));
        var output = {};
        changes.forEach(function (_a, index) {
            var oldValue = _a.oldValue, newValue = _a.newValue, hasChanged = _a.hasChanged;
            var name = labels[index] || "Dependency ".concat(index + 1);
            var icon = hasChanged ? GreenTickIcon : RedCrossIcon; // Use icons based on change
            output["\"".concat(icon, "\" - ").concat(name, " ")] = {
                "Old Value": oldValue,
                "New Value": newValue,
            };
        });
        console.log(output);
        console.groupEnd();
        // Update the ref with the current values
        prevValuesRef.current = dependencies;
    }, [componentName, dependencies, labels]);
};
export default useTrackDependency;
