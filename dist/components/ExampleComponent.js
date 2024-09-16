var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useState, useCallback } from "react";
import useTrackDependency from "../hooks/useTrackDependency";
var ExampleComponent = function () {
    // States to track
    var _a = useState(0), count = _a[0], setCount = _a[1];
    var _b = useState("Hello"), text = _b[0], setText = _b[1];
    var _c = useState({ name: "Alice", age: 25 }), complexState = _c[0], setComplexState = _c[1];
    // A callback function (tracked)
    var handleClick = useCallback(function () {
        setCount(function (prevCount) { return prevCount + 1; });
    }, []);
    // Track the re-renders and state changes using useTrackDependency
    useTrackDependency([count, text, complexState, handleClick], // Dependencies to track
    ["Count", "Text", "Complex State", "Handle Click"], // Labels for the dependencies
    "ExampleComponent" // Optional component name
    );
    return (React.createElement("div", null,
        React.createElement("h1", null, "useTrackDependency Example"),
        React.createElement("p", null,
            "Count: ",
            count),
        React.createElement("button", { onClick: handleClick }, "Increase Count"),
        React.createElement("p", null,
            "Text: ",
            text),
        React.createElement("button", { onClick: function () { return setText(text === "Hello" ? "World" : "Hello"); } }, "Toggle Text"),
        React.createElement("p", null,
            "Complex State: ",
            JSON.stringify(complexState)),
        React.createElement("button", { onClick: function () {
                return setComplexState(function (prevState) { return (__assign(__assign({}, prevState), { age: prevState.age + 1 })); });
            } }, "Increase Age")));
};
export default ExampleComponent;
