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
			console.log(
				"retrieved tasks",
				response,
				response.body,
				response.body["numTasks"],
				response.body.num_tasks,
				response.body.tasks
			);
			// If the response is ok, set the tasks state variable to
			// the response body tasks and set the numTasks state variable to
			// the response body numTasks
			if (response.ok) {
				const loaded_tasks = response.body.tasks;
				setNumTasks(response.body.num_tasks);
				setTasks(loaded_tasks);
				console.log(`tasks set to ${loaded_tasks} for list ${list.id}`);
				console.log(
					"new tasks value after SetTask and then setTasksArray is",
					tasks
				);
			} else {
				console.error(response.error);
			}
		};
		fetchTasks();
	}, [list]);

	// Handle the delete task button click
	const handleDeleteTask = async (taskId) => {
		console.log("handleDeleteTask called with taskId:", taskId);
		try {
			// Delete the task from the API
			const response = await api.delete(`/tasks/${taskId}`);
			console.log("response:", response);
			// If the response is ok, filter the tasks state variable to remove
			//the deleted task and set the tasks state variable to the updated tasks
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

	// Handle the delete list button click
	const handleDeleteList = () => {
		// Call the onDeleteList function passed as a prop from the body component
		onDeleteList(list.id);
	};

	// Handle the arrow click button click
	// const handleArrowClick = () => {
	// 	// Toggle the showSubtasks state variable
	// 	setShowSubtasks(!showSubtasks);
	// };

	// Initialize state to an empty object
	const [visibleSubtasks, setVisibleSubtasks] = useState({});

	// Toggle visibility when a parent task is clicked
	const handleArrowClick = (taskId) => {
		setVisibleSubtasks((prevState) => ({
			...prevState,
			[taskId]: !prevState[taskId],
		}));
	};

	// Return the list component
	return (
		<div className="lists-container">
			<h4 className="lists-heading">{list.title}</h4>
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
