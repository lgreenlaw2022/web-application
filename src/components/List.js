import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";
import "./css/List.css";

export default function List({ proplist }) {
    const [tasks, setTasks] = useState([]);
    const api = useApi();

    const [showSubtasks, setShowSubtasks] = useState(false);

    const handleArrowClick = () => {
        setShowSubtasks(!showSubtasks);
    };
    
    const handleTaskArrowClick = (taskId) => {
    // Find the task with the specified ID
        const task = proplist.tasks.find((t) => t.id === taskId);
        if (task) {
            // Toggle the subtasks for the task
            task.showSubtasks = !task.showSubtasks;
            setShowSubtasks(!showSubtasks);
        }
    };

    console.log(proplist.name)
    List.defaultProps = {
        tasks: [
            { id: 1, title: 'Task 1' },
            { id: 2, title: 'Task 2' },
            { id: 3, title: 'Task 3' },
        ],
        subtasks: [
            { id: 4, title: 'Subtask 1' },
            { id: 5, title: 'Subtask 2' },
            { id: 6, title: 'Subtask 3' },
        ],
        subsubtasks: [
            { id: 7, title: 'Subsubtask 1' },
            { id: 8, title: 'Subsubtask 2' },
            { id: 9, title: 'Subsubtask 3' },
        ]
    }

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await api.get(`/lists/${proplist.id}/tasks`);
            if (response.ok) {
                const tasks = response.data;
                for (const task of tasks) {
                    const subtasksResponse = await api.get(`/tasks?parentId=${task.id}`);
                    if (subtasksResponse.ok) {
                        task.subtasks = subtasksResponse.data;
                        for (const subtask of task.subtasks) {
                            const subsubtasksResponse = await api.get(
                                `/tasks?parentId=${subtask.id}`
                            );
                            if (subsubtasksResponse.ok) {
                                subtask.subtasks = subsubtasksResponse.data;
                            } else {
                                console.error(subsubtasksResponse.error);
                            }
                        }
                    } else {
                        console.error(subtasksResponse.error);
                    }
                }
                setTasks(tasks);
            } else {
                console.error(response.error);
            }
        };
        fetchTasks();
    }, [proplist]);

    return (
        <div className="lists-container">
            <h3 className="lists-heading">{proplist.name}</h3>
            <div>
                {List.defaultProps.tasks.map((task) => (
                    <div key={task.id}>
                        <Task className="lists-task" task={task} 
                            onArrowClick={handleTaskArrowClick}/>
                            {/* HARD CODED SUBTASKS */}
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
                            }
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

                    </div>
                ))}
            </div>
        </div>
    );
}