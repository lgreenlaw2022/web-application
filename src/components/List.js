import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";
import "./css/List.css";
import SubtaskList from "./SubtaskList";

export default function List({ list, onDeleteList }) {
    const [tasks, setTasks] = useState([]);
    const [numTasks, setNumTasks] = useState(null);
    const [currTask, setCurrTask] = useState(null);
    const [subtasks, setSubtasks] = useState([]);
    const [subsubtasks, setSubsubtasks] = useState([]);
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
    }, [list]); //list

    useEffect(() => {
        const fetchSubtasks = async () => {
            if (currTask) {
                const response = await api.get(`/tasks/${currTask.id}/subtasks`);
                console.log("fetch subtasks for task", response, response.body)
                if (response.ok) {
                    const loaded_subtasks = response.body.subtasks;
                    setSubtasks(loaded_subtasks);
                } else {
                    console.error(response.error);
                }
            }
        };
        fetchSubtasks();
    }, [currTask]); //currTask
 

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
                    {tasks.map((task) => {
                        // setCurrTask(task);
                        return (
                            <div key={task.id}>
                                <Task
                                    className="lists-task"
                                    task={task}
                                    listId={list.id}
                                    hasSubtask={subtasks.length > 0}
                                    onDelete={handleDeleteTask}
                                    onArrowClick={handleTaskArrowClick}
                                />
                                {/* <SubtaskList taskId={task.id} handleDeleteTask={handleDeleteTask} onArrowClick={handleArrowClick}/> */}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
