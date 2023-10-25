// import { useState, useEffect, useRef } from 'react';
// import Stack from "react-bootstrap/Stack";
// import Form from 'react-bootstrap/Form';
// import InputField from './InputField';
// import { Dropdown } from '@fluentui/react';
// import { useApi } from '../contexts/ApiProvider';
// import { useUser } from '../contexts/UserProvider';
// import "./css/WriteTask.css";

// export default function WriteTask({ showTask }) { //TODO: change showPost
//     const [lists, setLists] = useState([]);
//     const [selectedList, setSelectedList] = useState(null);
//     const [formErrors, setFormErrors] = useState({});
//     const textField = useRef();
//     const api = useApi();
//     const { user } = useUser();

//     useEffect(() => {
//         textField.current.focus();
//     }, []);

//     useEffect(() => {
//         const fetchLists = async () => {
//           const response = await api.get("/lists");
//           if (response.ok) {
//             setLists(response.data);
//           } else {
//             console.error(response.error);
//           }
//         };
//         fetchLists();
//       }, []);

//     const onSubmit = async (ev) => {
//         ev.preventDefault();
//         const response = await api.post("/newtask", { //TODO: route may not be right
//         text: textField.current.value
//         });
//         if (response.ok) {
//             showTask(response.body);
//             textField.current.value = '';
//         }
//         else {
//             if (response.body.errors) {
//                 setFormErrors(response.body.errors.json);
//             }
//         }
//     };

//     return (
//         <Stack direction="horizontal" gap={3} className="WriteTask">
//             <Form onSubmit={onSubmit}>
//                 <InputField name="text" label="add new task" placeholder="Add task"
//                             error={formErrors.text} fieldRef={textField} />
//                 <Dropdown
//                     label="Select list"
//                     options={lists.map((list) => ({
//                         key: list.id,
//                         text: list.title,
//                         data: list,
//                     }))}
//                     selectedKey={selectedList ? selectedList.id : undefined}
//                     onChange={(event, option) => setSelectedList(option.data)}
//                 />
//                 <button type="submit">Create</button>
//             </Form>
//         </Stack>
//     );
// }

import { Dropdown } from '@fluentui/react';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import { useState, useEffect, useRef } from 'react';
import './css/WriteTask.css';

export default function WriteTask() {
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isSubtask, setIsSubtask] = useState(false);
    const textField = useRef();
    const api = useApi();
    const { user } = useUser();

    useEffect(() => {
        textField.current.focus();
    }, []);

    useEffect(() => {
        const fetchLists = async () => {
            const response = await api.get('/lists');
            if (response.ok) {
                setLists(response.data);
            } else {
                console.error(response.error);
            }
        };

        fetchLists();
    }, [api]);

    const handleListChange = (event, option) => {
        setSelectedList(option.key);
        setSelectedTask(null);
        setSelectedSubtask(null);
        setIsSubtask(false);
    };

    const handleTaskChange = (event, option) => {
        setSelectedTask(option.key);
        setSelectedSubtask(null);
        setIsSubtask(false);
    };

    const handleSubtaskChange = (event, option) => {
        setSelectedSubtask(option.key);
    };

    const handleCheckboxChange = (event, checked) => {
        setIsSubtask(checked);
        setSelectedTask(null);
        setSelectedSubtask(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const title = textField.current.value.trim();
        const listId = selectedList;
        const taskId = isSubtask ? selectedSubtask : selectedTask;

        if (!title) {
            setFormErrors({ title: 'Title is required' });
            return;
        }

        const response = await api.post('/tasks', {
            title,
            listId,
            taskId,
            userId: user.id,
        });

        if (response.ok) {
            // TODO: what should happen here?
        } else {
            console.error(response.error);
        }
    };

    return (
        <form className="write-task-form" onSubmit={handleSubmit}>
            <h2 className="write-task-heading">Write a Task</h2>
            <div className="write-task-field">
                <label className="write-task-label" htmlFor="title">
                    Title
                </label>
                <input
                    className="write-task-input"
                    type="text"
                    id="title"
                    ref={textField}
                />
                {formErrors.title && (
                    <span className="write-task-error">{formErrors.title}</span>
                )}
            </div>
            <div className="write-task-field">
                <label className="write-task-label" htmlFor="list">
                    List
                </label>
                <Dropdown
                    className="write-task-dropdown"
                    id="list"
                    options={lists.map((list) => ({
                        key: list.id,
                        text: list.name,
                    }))}
                    selectedKey={selectedList}
                    onChange={handleListChange}
                />
            </div>
            {selectedList && (
                <div className="write-task-field">
                    <label className="write-task-label" htmlFor="task">
                        {isSubtask ? 'Subtask' : 'Task'}
                    </label>
                    <Dropdown
                        className="write-task-dropdown"
                        id="task"
                        options={lists
                            .find((list) => list.id === selectedList)
                            .tasks.map((task) => ({
                                key: task.id,
                                text: task.title,
                            }))}
                        selectedKey={isSubtask ? selectedSubtask : selectedTask}
                        onChange={isSubtask ? handleSubtaskChange : handleTaskChange}
                        disabled={!isSubtask}
                    />
                </div>
            )}
            {selectedList && (
                <div className="write-task-field">
                    <label className="write-task-label" htmlFor="subtask">
                        Subtask of a Subtask
                    </label>
                    <input
                        className="write-task-checkbox"
                        type="checkbox"
                        id="subtask"
                        checked={isSubtask}
                        onChange={handleCheckboxChange}
                    />
                </div>
            )}
            <div className="write-task-buttons">
                <button className="write-task-button" type="submit">
                    Save
                </button>
            </div>
        </form>
    );
}