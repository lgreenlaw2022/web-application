import React, { useState } from "react";
import "./css/Task.css";
import { useApi } from '../contexts/ApiProvider';
import MoveTaskForm from "./MoveTask";


export default function Task({ task, onTaskDelete }) {
    const api = useApi();
    const [deleted, setDeleted] = useState(false);
    const [showMoveForm, setShowMoveForm] = useState(false);
    const [tasks, setTasks] = useState([]);

    // const moveTask = async (task, destinationList) => {
    //     const response = await api.put(`/tasks/${task.id}`, {
    //       listId: destinationList.id,
    //     });
    //     if (response.ok) {
    //       const updatedTasks = tasks.map((t) =>
    //         t.id === task.id ? { ...t, listId: destinationList.id } : t
    //       );
    //       setTasks(updatedTasks);
    //     } else {
    //       console.error(response.error);
    //     }
    // };
    const handleMove = async (newListId) => {
        try {
            const response = await api.put(`/tasks/${task.id}`, {
                listId: newListId
            });
            if (response.ok) {
                const updatedTasks = tasks.map((t) =>
                    t.id === task.id ? { ...t, listId: newListId } : t
                );
                setTasks(updatedTasks);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

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

    const handleMouseEnter = () => {
        setShowMoveForm(true);
      };
    
      const handleMouseLeave = () => {
        setShowMoveForm(false);
      };

    // TODO: not sure this is going to rerender correctly
    return deleted ? null : ( 
        <div className="task-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
                
            <input type="checkbox" onClick={handleDelete}/>
            <span>{task.title}</span>
            {/* <button >Delete</button> */}
            {showMoveForm && (
                <MoveTaskForm
                task={task}
                // lists={lists}
                onMove={handleMove}
                onCancel={() => setShowMoveForm(false)}
                />
            )}
        </div>
    );
}