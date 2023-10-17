import React from "react";
import "./css/List.css";

export default function Lists({ list }) {
    return (
        <div className="lists-container">
            <h3 className="lists-heading">{list.name}</h3>
            <ul>
                {list.tasks.map((task) => (
                    <li key={task.id} className="lists-task">
                        {task.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}