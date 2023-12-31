import React, { useState, useEffect } from "react";
import { Dropdown } from "@fluentui/react";
import Form from "react-bootstrap/Form";
import { useApi } from "../contexts/ApiProvider";
import "./css/WriteTask.css";

const WriteTask = ({ prop_lists }) => {
	const [lists, setLists] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [subtasks, setSubtasks] = useState([]);
	const [selectedList, setSelectedList] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);
	const [selectedSubtask, setSelectedSubtask] = useState(null);
	const [isSubtask, setIsSubtask] = useState(false);
	const [isSubSubtask, setIsSubSubtask] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");
	const [numTasks, setNumTasks] = useState(null);
	const api = useApi();

	useEffect(() => {
		if (prop_lists && prop_lists.length > 0) {
			setLists(prop_lists);
		}
	}, [prop_lists]);

	useEffect(() => {
		if (selectedList) {
			const fetchTasks = async () => {
				const response = await api.get(
					`/lists/${selectedList.id}/tasks`
				);
				if (response.ok) {
					const loaded_tasks = response.body.tasks;
					setNumTasks(response.body.num_tasks);
					setTasks(loaded_tasks);
				} else {
					console.error(response.error);
				}
			};
			fetchTasks();
		}
	}, [selectedList, tasks]);

	useEffect(() => {
		const fetchSubtasks = async () => {
			if (selectedTask) {
				const response = await api.get(
					`/tasks/${selectedTask.id}/subtasks`
				);
				if (response.ok) {
					const loaded_subtasks = response.body.subtasks;
					setSubtasks(loaded_subtasks);
				} else {
					console.error(response.error);
				}
			}
		};
		fetchSubtasks();
	}, [selectedTask]);

	const handleListChange = (event, option) => {
		setSelectedList(
			option
				? {
						id: JSON.parse(option.key).id,
						title: JSON.parse(option.key).title,
				  }
				: null
		);
		setSelectedTask(null);
		setSelectedSubtask(null);
		setIsSubtask(false);
		setIsSubSubtask(false);
	};

	const handleTaskChange = (event, option) => {
		setSelectedTask(
			option
				? {
						id: JSON.parse(option.key).id,
						title: JSON.parse(option.key).title,
				  }
				: null
		);
		setSelectedSubtask(null);
		setIsSubSubtask(false);
	};

	const handleSubtaskChange = (event, option) => {
		setSelectedSubtask(
			option
				? {
						id: JSON.parse(option.key).id,
						title: JSON.parse(option.key).title,
				  }
				: null
		);
	};

	const handleSubtaskCheckboxChange = (event) => {
		setIsSubtask(event.target.checked);
		setSelectedTask(null);
		setSelectedSubtask(null);
		setIsSubSubtask(false);
	};

	const handleSubSubtaskCheckboxChange = (event) => {
		setIsSubSubtask(event.target.checked);
		setSelectedSubtask(null);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (taskTitle) {
			const taskData = {
				title: taskTitle,
			};

			// First, create the task in the task table
			const taskResponse = await api.post("/tasks", taskData);

			if (!taskResponse.ok) {
				console.error(taskResponse.error);
				return;
			}

			// Extract the ID of the newly created task
			// const task_id = taskResponse.body.id;
			const task_id = taskResponse.body.task_id;
			let responseIsOk = false;

			let response = null;

			// Next, create entries in the relationship tables based on the task type
			if (isSubSubtask && selectedSubtask) {
				// This is a sub-subtask, create a sub-subtask record
				const subSubtaskData = {
					parent_task_id: selectedSubtask.id,
					child_task_id: task_id,
				};
				response = await api.post("/task-subtask-relationship", {
					parent_task_id: selectedSubtask.id,
					child_task_id: task_id,
				});
				responseIsOk = response.ok;
			} else if (isSubtask && selectedTask) {
				response = await api.post("/task-subtask-relationship", {
					parent_task_id: selectedTask.id,
					child_task_id: task_id,
				});
				responseIsOk = response.ok;
			} else if (selectedList) {
				response = await api.post("/list-task-relationship", {
					list_id: selectedList.id,
					task_id: task_id,
				});
				responseIsOk = response.ok;
			}

			if (responseIsOk) {
				setTaskTitle("");
				setSelectedList(null);
				setSelectedTask(null);
				setSelectedSubtask(null);
				setIsSubtask(false);
				setIsSubSubtask(false);
				const newTask = response.body.task;
				setTasks([...tasks, newTask]);
			} else {
				console.error("Response not ok");
			}
		}
	};

	return (
		<div>
			<form className="WriteTask" onSubmit={handleSubmit}>
				<div>
					<div>
						<label htmlFor="taskTitle">Task Title</label>
						<input
							id="taskTitle"
							type="text"
							value={taskTitle}
							onChange={(event) =>
								setTaskTitle(event.target.value)
							}
						/>
					</div>
					<label htmlFor="list">List</label>
					<Dropdown
						id="list"
						options={lists.map((list) => ({
							key: JSON.stringify({
								id: list.id,
								title: list.title,
							}),
							text: list.title,
						}))}
						onChange={handleListChange}
						selectedKey={
							selectedList
								? JSON.stringify({
										id: selectedList["id"],
										title: selectedList["title"],
								  })
								: null
						}
					/>
				</div>

				{selectedList && tasks.length > 0 && (
					<div>
						<label htmlFor="isSubtask">Is Subtask</label>
						<Form.Check
							id="isSubtask"
							checked={isSubtask}
							onChange={handleSubtaskCheckboxChange}
						/>
					</div>
				)}
				{isSubtask && tasks.length > 0 && (
					<div>
						<label htmlFor="task">Parent Task</label>
						<Dropdown
							className="dropdown"
							id="task"
							options={tasks.map((task) => ({
								key: JSON.stringify({
									id: task.id,
									title: task.title,
								}),
								text: task.title,
							}))}
							selectedKey={
								selectedTask
									? JSON.stringify({
											id: selectedTask.id,
											title: selectedTask.title,
									  })
									: null
							}
							onChange={handleTaskChange}
						/>
					</div>
				)}
				{selectedTask && subtasks.length > 0 && (
					<div className="write-task-field">
						<label
							className="write-task-label"
							htmlFor="isSubSubtask"
						>
							Is Sub-Subtask
						</label>
						<Form.Check
							className="write-task-checkbox"
							id="isSubSubtask"
							checked={isSubSubtask}
							onChange={handleSubSubtaskCheckboxChange}
						/>
					</div>
				)}
				{isSubSubtask && subtasks.length > 0 && (
					<div className="write-task-field">
						<label className="write-task-label" htmlFor="subtask">
							Parent Subtask
						</label>
						<Dropdown
							className="write-task-dropdown"
							id="subtask"
							options={subtasks.map((subtask) => ({
								key: JSON.stringify({
									id: subtask.id,
									title: subtask.title,
								}),
								text: subtask.title,
							}))}
							selectedKey={
								selectedSubtask
									? JSON.stringify({
											id: selectedSubtask.id,
											title: selectedSubtask.title,
									  })
									: null
							}
							onChange={handleSubtaskChange}
						/>
					</div>
				)}
				<div className="write-task-field">
					<button type="submit">Add Task</button>
				</div>
			</form>
		</div>
	);
};

export default WriteTask;
