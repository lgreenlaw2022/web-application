import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";
import "./css/List.css";

export default function List({ list }) {
    const [tasks, setTasks] = useState([]);
    const api = useApi();

    const [showSubtasks, setShowSubtasks] = useState(false);

    const handleArrowClick = () => {
        setShowSubtasks(!showSubtasks);
    };
    
    const handleTaskArrowClick = (taskId) => {
    // Find the task with the specified ID
        const task = list.tasks.find((t) => t.id === taskId);
        if (task) {
            // Toggle the subtasks for the task
            task.showSubtasks = !task.showSubtasks;
            setShowSubtasks(!showSubtasks);
        }
    };

    useEffect(() => {
        async function fetchTasks() {
            const response = await api.get(`/lists/${list["id"]}/tasks`);
            console.log("retrieved tasks", response, response.body)
            if (response.ok) {
                setTasks(response.body);
            } else {
                console.error(response.error);
            }
        }
        fetchTasks();
    }, [list]);


    return (
        <div className="lists-container">
            {console.log("list info passed to list component", list, list.tile)}
            <h4 className="lists-heading">{list.title}</h4>
            <div>
                {tasks.map((task) => (
                    <Task className="lists-task" task={task} onArrowClick={handleTaskArrowClick}/>}
                )}
            </div>
        </div>
    );
}


                {/* {tasks.map((task) => (
                    <div key={task.id}>
                        <Task className="lists-task" task={task} 
                            onArrowClick={handleTaskArrowClick}/>
                            
                           { task.showSubtasks && 
                            List.defaultProps.subtasks.map((subtask) => (
                                <div key={subtask.id}>
                                    <Task className="lists-task" task={subtask} 
                                    onArrowClick={handleTaskArrowClick}/>
                                    { subtask.showSubtasks && 
                                    List.defaultProps.subsubtasks.map((subsubtask) => (
                                        <Task
                                            key={subsubtask.id}
                                            className="lists-task"
                                            task={subsubtask}
                                        />
                                    ))}
                                </div>
                            ))
                            } */}
                            {/* DYNAMIC SUBTASKS */}
                        {/* {task.subtasks &&
                            task.subtasks.map((subtask) => (
                                <div key={subtask.id}>
                                    <Task className="lists-task" task={subtask} />
                                    {subtask.subtasks &&
                                        subtask.subtasks.map((subsubtask) => (
                                            <Task
                                                key={subsubtask.id}
                                                className="lists-task"
                                                task={subsubtask}
                                            />
                                        ))}
                                </div>
                            ))} */}

                    {/* </div> */}
                {/* ))} */}