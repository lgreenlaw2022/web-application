import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";
import "./css/List.css";
import SubtaskList from "./SubtaskList";

export default function List({ list, onDeleteList }) {
	const [tasks, setTasks] = useState([]);
	const [numTasks, setNumTasks] = useState(null);
	const [showSubtasks, setShowSubtasks] = useState(false);
	// Get the api from the ApiProvider context
	const api = useApi();

	// Fetch the tasks from the API when the list is changed
	useEffect(() => {
		const fetchTasks = async () => {
			// Get the tasks from the API
			const response = await api.get(`/lists/${list.id}/tasks`);
			// If the response is ok, set the tasks state variable to
			// the response body tasks and set the numTasks state variable to
			// the response body numTasks
			if (response.ok) {
				const loaded_tasks = response.body.tasks;
				setNumTasks(response.body.num_tasks);
				setTasks(loaded_tasks);
			} else {
				console.error(response.error);
			}
		};
		fetchTasks();
	}, [list]);

	// Handle the delete task button click
	const handleDeleteTask = async (taskId) => {
		try {
			// Delete the task from the API
			const response = await api.delete(`/tasks/${taskId}`);
			// If the response is ok, filter the tasks state variable to remove
			//the deleted task and set the tasks state variable to the updated tasks
			if (response.ok) {
				const updatedTasks = tasks.filter((t) => t.id !== taskId);
				setTasks(updatedTasks);
			} else {
				console.error(response.error);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Handle the delete list button click
	const handleDeleteList = () => {
		// Call the onDeleteList function passed as a prop from the body component
		onDeleteList(list.id);
	};

	// Initialize state to an empty object
	const [visibleSubtasks, setVisibleSubtasks] = useState({});

	// Toggle visibility when a parent task is clicked
	const handleArrowClick = (taskId) => {
		setVisibleSubtasks((prevState) => ({
			...prevState,
			[taskId]: !prevState[taskId],
		}));
	};

	// Add state variables for editing list name
	const [isEditing, setIsEditing] = useState(false);
	const [newName, setNewName] = useState(list.title);

	// Add functions to handle editing list name
	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		try {
			const response = await api.put(`/lists/${list.id}`, {
				title: newName,
			});
			if (response.ok) {
				setIsEditing(false);
			} else {
				console.error(response.error);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Return the list component
	return (
		<div className="lists-container">
			{isEditing ? (
				<input
					type="text"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
				/>
			) : (
				<h4 className="lists-heading">{list.title}</h4>
			)}
			<button onClick={isEditing ? handleSave : handleEdit}>
				{isEditing ? "Save" : "Edit"}
			</button>
			<button onClick={handleDeleteList}>Delete</button>
			{numTasks > 0 && (
				<div>
					{tasks.map((task) => {
						return (
							<div key={task.id}>
								<Task
									className="lists-task"
									task={task}
									listId={list.id}
									onDelete={handleDeleteTask}
									onArrowClick={() =>
										handleArrowClick(task.id)
									}
								/>
								{/* Render SubtaskList only if there are subtasks */}
								{visibleSubtasks[task.id] && (
									<SubtaskList
										taskId={task.id}
										handleDeleteTask={handleDeleteTask}
									/>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
