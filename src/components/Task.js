import React, { useState } from "react";
import "./css/Task.css";
import { useApi } from '../contexts/ApiProvider';
import MoveTaskForm from "./MoveTask";


export default function Task({ task, listId=null, hasSubtask=false, onDelete, onArrowClick, isSubTask=false, 
                                isSubSubtask=false }) {
    const api = useApi();
    const [deleted, setDeleted] = useState(false);
    const [showMoveForm, setShowMoveForm] = useState((!isSubTask && !isSubSubtask));
    const [showArrowContainer, setShowArrowContainer] = useState(false);
    const [tasks, setTasks] = useState([]);

    const handleMove = async (newListId) => {
        console.log("handleMove called with newListId:", newListId);
        console.log("handleMove called with task.id:", task.id)
        console.log("handleMove called with listId:", newListId)
        const move_response = await api.post('/list-task-relationship', {list_id: newListId, task_id: task.id});
        console.log("move_response:", move_response);
        const delete_response = await api.delete(`/delete/parent-task/${listId}/${task.id}`);
        console.log("delete_response:", delete_response);     
    };

    //I think I should move this to the list component, so I have access to the parent clearly
    const handleDelete = () => {
        onDelete(task.id);
        setDeleted(true);
    };
    //     const response = await api.delete(`/tasks/${task.id}`);

    //     // TODO: on handle delete should all of the subtasks be deleted as well? or can they just be hidden?
        
    //     if (response.ok) {
    //         // TODO: want to make it so that it is hidden from the list and then deleted on refresh
    //         setDeleted(true);
    //         console.log(deleted)
    //         onTaskDelete(task.id);
    //     } else {
    //         console.error(response.error);
    //     }
    // };

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

    // TODO: not sure this is going to rerender correctly
    return deleted ? null : (  //TODO: should I change this to tell in the list component to not render it?
        <div className="task-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {hasSubtask && (
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