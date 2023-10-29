import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";

function SubtaskList({ taskId, handleDeleteTask, handleTaskArrowClick }) {
    const [subtasks, setSubtasks] = useState([]);
    const [subsubtasks, setSubsubtasks] = useState([]);
    const [currTask, setCurrTask] = useState(taskId);
    const [isSubSubtask, setIsSubSubtask] = useState(false);
    const api = useApi();


    useEffect(() => {
        const fetchSubtasks = async () => {
            if (currTask) {
                const response = await api.get(`/tasks/${currTask.id}/subtasks`);
                console.log("fetch subtasks for task", response, response.body)
                if (response.ok) {
                    const loaded_subtasks = response.body.subtasks;
                    if (isSubSubtask) {
                        setSubsubtasks(loaded_subtasks);
                    } else {
                        setSubtasks(loaded_subtasks);
                    }
                } else {
                    console.error(response.error);
                }
            }
        };
        fetchSubtasks();
    }, []); //currTask

    return (
        subtasks && subtasks.length > 0 && (
            <div className="lists-subtasks">
                {subtasks.map((subtask) => {
                    setCurrTask(subtask);
                    setIsSubSubtask(false);
                    return (
                        <div key={subtask.id}>
                            <Task
                                className="lists-task"
                                task={subtask}
                                isSubTask={true}
                                hasSubtask={subsubtasks.length > 0}
                                onDelete={handleDeleteTask}
                                onArrowClick={handleTaskArrowClick}
                            />
                            {subsubtasks && subsubtasks.length > 0 && (
                                <div className="lists-subsubtasks">  
                                    {subsubtasks.map((subsubtask) => {
                                        setCurrTask(subsubtask);
                                        setIsSubSubtask(true);
                                        return (
                                            <Task
                                                key={subsubtask.id}
                                                className="lists-task"
                                                task={subsubtask}
                                                isSubSubtask={true}
                                                onDelete={handleDeleteTask}
                                                onArrowClick={handleTaskArrowClick}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        )
    )
};

export default SubtaskList;