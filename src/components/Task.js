import React, { useState, useEffect } from "react";
import { useApi } from '../contexts/ApiProvider';
import MoveTaskForm from "./MoveTask";
import "./css/Task.css";


export default function Task({ task, listId=null, onDelete, onArrowClick, isSubTask=false, 
                                isSubSubtask=false }) {
    const api = useApi();
    const [deleted, setDeleted] = useState(false);
    const [showMoveForm, setShowMoveForm] = useState((!isSubTask && !isSubSubtask));
    const [showArrowContainer, setShowArrowContainer] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [hasSubtasks, setHasSubtasks] = useState(false);

    useEffect(() => {
        const fetchSubtasks = async () => {
            const response = await api.get(`/tasks/${task.id}/subtasks`);
            console.log("fetch subtasks for task", response, response.body)
            if (response.ok) {
                const loaded_subtasks = response.body.subtasks;
                setHasSubtasks(loaded_subtasks.length > 0);
            } else {
                console.error(response.error);
            }
        };
        fetchSubtasks();
    }, []); // the task will not change so there is no need for later rerender

    const handleMove = async (newListId) => {
        console.log("handleMove called with newListId:", newListId);
        console.log("handleMove called with task.id:", task.id)
        const move_response = await api.post('/list-task-relationship', {list_id: newListId, task_id: task.id});
        console.log("move_response:", move_response);
        const delete_response = await api.delete(`/delete/parent-task/${listId}/${task.id}`);
        console.log("delete_response:", delete_response);     
    };

    const handleDelete = () => {
        onDelete(task.id);
        setDeleted(true);
    };

    const handleArrowClick = () => {
        setShowArrowContainer(!showArrowContainer);
        onArrowClick(task.id);
    };

    const handleMouseEnter = () => {
        setShowMoveForm(true);
    };
    
    const handleMouseLeave = () => {
        setShowMoveForm(false);
    };

    return deleted ? null : (
        <div className="task-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {console.log("task", task.id,"hasSubtask", hasSubtasks)}
            {hasSubtasks && ( 
                <div className="arrow-container" onClick={handleArrowClick}>
                    <i>{showArrowContainer ? "-" : "+"}</i>
                </div>   
            ) 
            }           
            <input type="checkbox" onClick={handleDelete}/>
            <span>{task.title}</span>
            
            {showMoveForm && (
                <MoveTaskForm
                task={task}
                // lists={lists}
                onMove={handleMove}
                />
            )}
            {/* {showSubtasks && (
                <SubtaskList
                subtasks={task.subtasks}
                listId={listId}
                onDelete={onDelete}
                onArrowClick={onArrowClick}
                />
            )} */}
        </div>
    );
}