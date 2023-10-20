import React, { useState } from "react";
import "./css/Task.css";
import { useApi } from '../contexts/ApiProvider';


export default function Task({ task, onTaskDelete }) {
    const api = useApi();
    const [deleted, setDeleted] = useState(false);

    const handleDelete = async () => {
        const response = await api.delete(`/tasks/${task.id}`);
        if (response.ok) {
            // TODO: want to make it so that it is hidden from the list and then deleted on refresh
            setDeleted(true);
            console.log(deleted)
            onTaskDelete(task.id);
        } else {
            console.error(response.error);
        }
    };
    // TODO: not sure this is going to rerender correctly
    return deleted ? null : ( 
        <div className="task-container">
            <input type="checkbox" onClick={handleDelete}/>
            <span>{task.title}</span>
            {/* <button >Delete</button> */}
        </div>
    );
  }