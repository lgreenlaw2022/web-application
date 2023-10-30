import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import MoveTaskForm from "./MoveTask";
import "./css/Task.css";

export default function Task({
	task,
	listId = null,
	onDelete,
	onArrowClick,
	isSubTask = false,
	isSubSubtask = false,
}) {
	const api = useApi();
	const [deleted, setDeleted] = useState(false);
	const [showMoveForm, setShowMoveForm] = useState(false);
	const [showArrowContainer, setShowArrowContainer] = useState(false);
	const [hasSubtasks, setHasSubtasks] = useState(false);

	// fetch subtasks for task
	useEffect(() => {
		const fetchSubtasks = async () => {
			const response = await api.get(`/tasks/${task.id}/subtasks`);
			console.log("fetch subtasks for task", response, response.body);
			if (response.ok) {
				const loaded_subtasks = response.body.subtasks;
				setHasSubtasks(loaded_subtasks.length > 0);
			} else {
				console.error(response.error);
			}
		};
		fetchSubtasks();
	}, []); // the task will not change so there is no need for later rerender

	// handleMove function to move task to new list
	const handleMove = async (newListId) => {
		const move_response = await api.post("/list-task-relationship", {
			list_id: newListId,
			task_id: task.id,
		});
		console.log("move_response:", move_response);
		const delete_response = await api.delete(
			`/delete/parent-task/${listId}/${task.id}`
		);
		console.log("delete_response:", delete_response);
	};

	// delete task passed by either List or SubtaskList components
	const handleDelete = () => {
		onDelete(task.id);
		setDeleted(true);
	};

	// handleArrowClick function to show/hide arrow container
	const handleArrowClick = () => {
		setShowArrowContainer(!showArrowContainer);
		onArrowClick();
	};

	// function to show move form
	const handleMouseEnter = () => {
		setShowMoveForm(true);
	};

	// function to hide move form
	const handleMouseLeave = () => {
		setShowMoveForm(false);
	};

	return deleted ? null : (
		<div
			className="task-container"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* logic to show the plus or minus sign indicating if subtasks exist and are showing */}
			{hasSubtasks && (
				<div className="arrow-container" onClick={handleArrowClick}>
					<i>{showArrowContainer ? "-" : "+"}</i>
				</div>
			)}
			<input type="checkbox" onClick={handleDelete} />
			<span>{task.title}</span>
			{/* only allow move form to appear for parent tasks */}
			{!isSubTask && !isSubSubtask && showMoveForm && (
				<MoveTaskForm onMove={handleMove} />
			)}
		</div>
	);
}
