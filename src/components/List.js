import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";
import "./css/List.css";

export default function List({ list, onDeleteList }) {
    const [tasks, setTasks] = useState([]);
    const [numTasks, setNumTasks] = useState(null);
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
        const fetchTasks = async () => {
            // console.log("trying to get tasks for ", 5)//list["id"])
            const response = await api.get(`/lists/${list.id}/tasks`);
            // const response = a wait api.get(`/lists/5/tasks`);
            console.log("retrieved tasks", response, response.body,response.body["numTasks"], response.body.num_tasks, response.body.tasks)
            if (response.ok) {
                const loaded_tasks = response.body.tasks;
                setNumTasks(response.body.num_tasks)
                setTasks(loaded_tasks);
                console.log(`tasks set to ${loaded_tasks} for list ${list.id}`)
                console.log("new tasks value after SetTask and then setTasksArray is", tasks) //tasksArray)
            } else {
                console.error(response.error);
            }
        };
        fetchTasks();
    }, [list]);

    const handleDeleteTask = async (taskId) => {
        console.log("handleDeleteTask called with taskId:", taskId);
        try {
            const response = await api.delete(`/tasks/${taskId}`);
            console.log("response:", response);
            if (response.ok) {
                const updatedTasks = tasks.filter((t) => t.id !== taskId);
                console.log("updatedTasks:", updatedTasks);
                setTasks(updatedTasks);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteList = () => {
        onDeleteList(list.id);
        // setDeleted(true);
    };


    return (
        <div className="lists-container">
            {console.log("list info passed to list component", list, list.title)}
            <h4 className="lists-heading">{list.title}</h4>
            <button onClick={handleDeleteList}>Delete</button>
            {console.log("tasks in return for list", tasks, numTasks)}
            {numTasks > 0 && (
                <div>
                    {tasks.map((task) => (
                        <Task className="lists-task" task={task} listId={list.id} onDelete={handleDeleteTask} onArrowClick={handleTaskArrowClick}/>
                        
                    ))}
                </div>
            )}
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