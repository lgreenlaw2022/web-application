import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import Task from "./Task";
import "./css/Task.css";

export default function SubtaskList({ taskId, handleDeleteTask }) {
	const [subtasks, setSubtasks] = useState([]);
	const [subsubtasksMap, setSubsubtasksMap] = useState({});
	const [showSubsubtasks, setShowSubsubtasks] = useState(false);
	const api = useApi();

	// Fetch the subtasks for the task
	useEffect(() => {
		const fetchSubtasks = async () => {
			const response = await api.get(`/tasks/${taskId}/subtasks`);
			if (response.ok) {
				const loaded_subtasks = response.body.subtasks;
				setSubtasks(loaded_subtasks);
			} else {
				console.error(response.error);
			}
		};
		fetchSubtasks();
	}, [subtasks]);

	// Fetch the subsubtasks for the subtasks
	useEffect(() => {
		const fetchSubsubtasks = async (subtaskId) => {
			const response = await api.get(`/tasks/${subtaskId}/subtasks`);
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

	const [visibleSubtasks, setVisibleSubtasks] = useState({});

	const handleArrowClick = (taskId) => {
		setVisibleSubtasks((prevState) => ({
			...prevState,
			[taskId]: !prevState[taskId],
		}));
	};

	return (
		// Render the subtasks if there are any
		subtasks &&
		subtasks.length > 0 && (
			<div className="lists-subtasks">
				{subtasks.map((subtask) => {
					const subsubtasks = subsubtasksMap[subtask.id] || [];
					return (
						<div key={subtask.id} className="subtask">
							{/* Render the subtask */}
							<Task
								className="lists-task"
								task={subtask}
								isSubTask={true}
								onDelete={handleDeleteTask}
								onArrowClick={() =>
									handleArrowClick(subtask.id)
								}
							/>
							{/* Render the subsubtasks if the showSubsubtasks state is true */}
							{visibleSubtasks[subtask.id] &&
								subsubtasks &&
								subsubtasks.length > 0 && (
									<div className="subsubtask">
										{subsubtasks.map((subsubtask) => (
											// Render the subsubtask
											<Task
												key={subsubtask.id}
												className="lists-task"
												task={subsubtask}
												isSubSubtask={true}
												onDelete={handleDeleteTask}
												onArrowClick={handleArrowClick}
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
