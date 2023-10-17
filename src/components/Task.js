import React from "react";
import "./css/Task.css";

export default function Task({ taskName }) {
    return (
        <div className="task-container">
            <input type="checkbox" />
            <p className="task-name">{taskName}</p>
        </div>
    );
}