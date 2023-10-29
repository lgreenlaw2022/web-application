import React, { useState, useEffect } from 'react';
import { Dropdown } from '@fluentui/react';
import Form from 'react-bootstrap/Form';
import { useApi } from '../contexts/ApiProvider';

const WriteTask = ({ prop_lists }) => {
    const [lists, setLists] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [isSubtask, setIsSubtask] = useState(false);
    const [isSubSubtask, setIsSubSubtask] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [numTasks, setNumTasks] = useState(null);
    const api = useApi();

    useEffect(() => {
        if (prop_lists && prop_lists.length > 0) {
            setLists(prop_lists);
        }
    }, []); //prop_lists

    // useEffect(() => {
    //     const fetchLists = async () => {
    //         const response = await api.get('/lists');
    //         if (response.ok) {
    //             setLists(response.body);
    //         } else {
    //             console.error(response.error);
    //         }
    //     };
    //     fetchLists();
    // }, [api]);

    useEffect(() => {
        if (selectedList){
            const fetchTasks = async () => {
                console.log("fetching tasks for write form for list", selectedList.id)
                const response = await api.get(`/lists/${selectedList.id}/tasks`);
                // const response = a wait api.get(`/lists/5/tasks`);
                console.log("retrieved tasks", response.body.num_tasks, response.body.tasks)
                if (response.ok) {
                    const loaded_tasks = response.body.tasks;
                    setNumTasks(response.body.num_tasks)
                    setTasks(loaded_tasks);
                    console.log(`tasks set to ${loaded_tasks} for list ${selectedList.id}`)
                    console.log("new tasks value after SetTask and then setTasksArray is", tasks) //tasksArray)
                } else {
                    console.error(response.error);
                }
            };
            fetchTasks();}
    }, []); //selectedList, tasks

    useEffect(() => {
        const fetchSubtasks = async () => {
            if (selectedTask) {
                const response = await api.get(`/tasks/${selectedTask.id}/subtasks`);
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
    }, [api, selectedTask]);

    const handleListChange = (event, option) => {
        setSelectedList(option ? { id: JSON.parse(option.key).id, title: JSON.parse(option.key).title } : null);
        setSelectedTask(null);
        setSelectedSubtask(null);
        setIsSubtask(false);
        setIsSubSubtask(false);
    };

    const handleTaskChange = (event, option) => {
        setSelectedTask(option ? { id: JSON.parse(option.key).id, title: JSON.parse(option.key).title } : null);
        setSelectedSubtask(null);
        setIsSubSubtask(false);
    };

    const handleSubtaskChange = (event, option) => {
        setSelectedSubtask(option ? { id: JSON.parse(option.key).id, title: JSON.parse(option.key).title } : null);
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
            const taskResponse = await api.post('/tasks', taskData);
            
            if (!taskResponse.ok) {
                console.error(taskResponse.error);
                return;
            }
    
            // Extract the ID of the newly created task
            // const task_id = taskResponse.body.id;
            const task_id = taskResponse.body.task_id;
            console.log("________task id________", task_id, taskResponse.body)
            let responseIsOk = false; // TODO: delete
            
            let response = null;
    
            // Next, create entries in the relationship tables based on the task type
            if (isSubSubtask && selectedSubtask) {
                // This is a sub-subtask, create a sub-subtask record
                const subSubtaskData = {
                    parent_task_id: selectedSubtask.id,
                    child_task_id: task_id,
                };
                response = await api.post('/task-subtask-relationship', {parent_task_id: selectedSubtask.id, child_task_id: task_id});
                responseIsOk = response.ok;
            } else if (isSubtask && selectedTask) {
                // This is a subtask, create a subtask record
                // const subtaskData = {
                //     parent_task_id: selectedTask.id,
                //     child_task_id: task_id,
                // };
                response = await api.post('/task-subtask-relationship', {parent_task_id: selectedTask.id, child_task_id: task_id});
                responseIsOk = response.ok;
            } else if (selectedList) {
                // This is a top-level task, create a list-task-relationship record
                // const listTaskData = {
                //     list_id: selectedList.id,
                //     task_id: task_id,
                // };
                response = await api.post('/list-task-relationship', {list_id: selectedList.id, task_id: task_id});
                responseIsOk = response.ok;
            }
    
            if (responseIsOk) {
                setTaskTitle('');
                setSelectedList(null);
                setSelectedTask(null);
                setSelectedSubtask(null);
                setIsSubtask(false);
                setIsSubSubtask(false);
            } else {
                console.error("Response not ok");
            }
        }
    };
    

    return (
        <form className="write-task-form" onSubmit={handleSubmit}>
            <div className="write-task-field">
                <div className="write-task-field">
                    <label className="write-task-label" htmlFor="taskTitle">
                        Task Title
                    </label>
                    <input className="write-task-input" id="taskTitle" type="text" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
                </div>
                <label className="write-task-label" htmlFor="list">
                    List
                </label>
                <Dropdown
                    className="write-task-dropdown"
                    id="list"
                    options={lists.map((list) => ({
                        key: JSON.stringify({ id: list.id, title: list.title }),
                        text: list.title,
                    }))}
                    onChange={handleListChange}
                    selectedKey={selectedList ? JSON.stringify({ id: selectedList["id"], title: selectedList["title"] }) : null}
                    
                />
                {console.log("_____SELECTED LIST_____", selectedList)}
                {console.log("_____SUB TASKS_____", tasks)}
            </div>
            
            {selectedList && tasks.length > 0 && (
                <div className="write-task-field">
                    {console.log("Is Subtask")}
                    <label className="write-task-label" htmlFor="isSubtask">
                        Is Subtask
                    </label>
                    <Form.Check className="write-task-checkbox" id="isSubtask" checked={isSubtask} onChange={handleSubtaskCheckboxChange} />
                </div>
            )}
            {isSubtask && tasks.length > 0 && (
                <div className="write-task-field">
                    <label className="write-task-label" htmlFor="task">
                        Parent Task
                    </label>
                    <Dropdown
                        className="write-task-dropdown"
                        id="task"
                        options={tasks.map((task) => ({
                            key: JSON.stringify({ id: task.id, title: task.title }),
                            text: task.title,
                        }))}
                        selectedKey={selectedTask ? JSON.stringify({ id: selectedTask.id, title: selectedTask.title }) : null}
                        onChange={handleTaskChange}
                    />
                </div>
            )}
            {selectedTask && subtasks.length > 0 && (
                <div className="write-task-field">
                    {console.log("Is Sub-Subtask")}
                    <label className="write-task-label" htmlFor="isSubSubtask">
                        Is Sub-Subtask
                    </label>
                    <Form.Check className="write-task-checkbox" id="isSubSubtask" checked={isSubSubtask} onChange={handleSubSubtaskCheckboxChange} />
                </div>
            )}
            {isSubSubtask && subtasks.length > 0 && (
                <div className="write-task-field">
                    {console.log("Is Parent Subtask")}
                    <label className="write-task-label" htmlFor="subtask">
                        Parent Subtask
                    </label>
                    <Dropdown
                        className="write-task-dropdown"
                        id="subtask"
                        options={subtasks.map((subtask) => ({
                            key: JSON.stringify({ id: subtask.id, title: subtask.title }),
                            text: subtask.title,
                        }))}
                        selectedKey={selectedSubtask ? JSON.stringify({ id: selectedSubtask.id, title: selectedSubtask.title }) : null}
                        onChange={handleSubtaskChange}
                    />
                </div>
            )}
            <div className="write-task-field">
                <button type="submit">Add Task</button>
            </div>
        </form>
    );
};

export default WriteTask;















// import { Dropdown } from '@fluentui/react';
// import { useApi } from '../contexts/ApiProvider';
// import { useUser } from '../contexts/UserProvider';
// import { useState, useEffect, useRef } from 'react';
// import './css/WriteTask.css';

// export default function WriteTask({ prop_lists }) {
//     const [formErrors, setFormErrors] = useState({});
//     const textField = useRef();
//     const api = useApi();
//     const { user } = useUser();
//     const [selectedList, setSelectedList] = useState(null);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [isSubtask, setIsSubtask] = useState(false);
//     const [tasks, setTasks] = useState([]);

//     // useEffect(() => {
//     //     const fetchTasks = async () => {
//     //         if (selectedList) {
//     //             const response = await api.get(`/lists/${selectedList.id}/tasks`);
//     //             if (response.ok) {
//     //                 setTasks(response.body);
//     //             } else {
//     //                 console.error(response.error);
//     //             }
//     //         }
//     //     };
//     //     fetchTasks();
//     // }, [selectedList]);

//     const [tasksCache, setTasksCache] = useState({});

//     useEffect(() => {
//         const fetchTasks = async () => {
//             if (selectedList) {
//                 if (tasksCache[selectedList.id]) {
//                     setTasks(tasksCache[selectedList.id]);
//                 } else {
//                     const response = await api.get(`/lists/${selectedList.id}/tasks`);
//                     if (response.ok) {
//                         const tasks = response.body;
//                         setTasksCache((prevCache) => ({
//                             ...prevCache,
//                             [selectedList.id]: tasks,
//                         }));
//                         console.log("fetch tasks for list", response, tasks)
//                         setTasks(tasks);
//                     } else {
//                         console.error(response.error);
//                     }
//                 }
//             }
//         };
//         fetchTasks();
//     }, [api, selectedList, tasksCache]);



//     const handleListChange = (event, option) => {
//         setSelectedList(JSON.parse(option.key));
//         setSelectedTask(null);
//         setIsSubtask(false);
//     };

//     const handleTaskChange = (event, option) => {
//         setSelectedTask(JSON.parse(option.key));
//         setIsSubtask(true);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const title = textField.current.value;
//         const list_id = selectedList.id;
//         const parent_id = isSubtask ? selectedTask.id : null;
//         const response = await api.post('/tasks', { title, list_id, parent_id });
//         if (response.ok) {
//             textField.current.value = '';
//             setSelectedList(null);
//             setSelectedTask(null);
//             setIsSubtask(false);
//         } else {
//             if (response.body.errors) {
//                 setFormErrors(response.body.errors.json);
//             }
//         }
//     };

//     return (
//         <form className="write-task-form" onSubmit={handleSubmit}>
//             <h2 className="write-task-heading">Write a Task</h2>
//             <div className="write-task-field">
//                 <label className="write-task-label" htmlFor="title">
//                     Title
//                 </label>
//                 <input
//                     className="write-task-input"
//                     type="text"
//                     id="title"
//                     ref={textField}
//                 />
//                 {formErrors.title && (
//                     <span className="write-task-error">{formErrors.title}</span>
//                 )}
//             </div>
//             <div className="write-task-field">
//                 <label className="write-task-label" htmlFor="list">
//                     List
//                 </label>
//                 <Dropdown
//                     className="write-task-dropdown"
//                     id="list"
//                     options={prop_lists.map((list) => ({
//                         key: JSON.stringify({ id: list["id"], title: list["title"] }),
//                         text: list["title"],
//                     }))}
//                     selectedKey={selectedList ? JSON.stringify({ id: selectedList.id, title: selectedList.title }) : null}
//                     onChange={handleListChange}
//                 />
//             </div>
//             {selectedList && (
//                 <div className="write-task-field">
//                     <label className="write-task-label" htmlFor="task">
//                         {isSubtask ? 'Subtask' : 'Task'}
//                     </label>
//                     {console.log}
//                     <Dropdown
//                         className="write-task-dropdown"
//                         id="task"
//                         options={tasks.map((task) => ({
//                             key: JSON.stringify({ id: task["id"], title: task["title"] }),
//                             text: task["title"],
//                         }))}
//                         selectedKey={selectedTask ? JSON.stringify({ id: selectedTask.id, title: selectedTask.title }) : null}
//                         onChange={handleTaskChange}
//                     />
//                 </div>
//             )}
//             <div className="write-task-field">
//                 <button type="submit">Add Task</button>
//             </div>
//         </form>
//     );
// }