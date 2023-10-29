import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";
import "./css/Task.css";

function SubtaskList({ taskId, handleDeleteTask, handleTaskArrowClick }) {
    const [subtasks, setSubtasks] = useState([]);
    const [subsubtasksMap, setSubsubtasksMap] = useState({});
    const [currTask, setCurrTask] = useState(taskId);
    const [isSubSubtask, setIsSubSubtask] = useState(false);
    const api = useApi();

    useEffect(() => {
        const fetchSubtasks = async () => {
            const response = await api.get(`/tasks/${taskId}/subtasks`);
            console.log("fetch subtasks for task", response, response.body)
            if (response.ok) {
                const loaded_subtasks = response.body.subtasks;
                setSubtasks(loaded_subtasks);
            } else {
                console.error(response.error);
            }
        };
        fetchSubtasks();
    }, []); //currTask

    useEffect(() => {
        const fetchSubsubtasks = async (subtaskId) => {
            const response = await api.get(`/tasks/${subtaskId}/subtasks`);
            console.log("fetch subsubtasks for subtask", response, response.body)
            if (response.ok) {
                const loaded_subsubtasks = response.body.subtasks;
                setSubsubtasksMap((prevMap) => ({
                    ...prevMap,
                    [subtaskId]: loaded_subsubtasks,
                }));
            } else {
                console.error(response.error);
            }
        };
        subtasks.forEach((subtask) => {
            fetchSubsubtasks(subtask.id);
        });
    }, [subtasks]);

    return (
        subtasks && subtasks.length > 0 && (
            <div className="lists-subtasks">
                {subtasks.map((subtask) => {
                    const subsubtasks = subsubtasksMap[subtask.id] || [];
                    return (
                        <div key={subtask.id} className="subtask">
                            <Task
                                className="lists-task"
                                task={subtask}
                                isSubTask={true}
                                onDelete={handleDeleteTask}
                                onArrowClick={handleTaskArrowClick}
                            />
                            {subsubtasks && subsubtasks.length > 0 && (
                                <div className="subsubtask">
                                    {subsubtasks.map((subsubtask) => (
                                        <Task
                                            key={subsubtask.id}
                                            className="lists-task"
                                            task={subsubtask}
                                            isSubSubtask={true}
                                            onDelete={handleDeleteTask}
                                            onArrowClick={handleTaskArrowClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        )
    );
}

export default SubtaskList;