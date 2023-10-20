import React, {useState, useEffect} from "react";
import { useApi } from '../contexts/ApiProvider';
import Task from "./Task";
import "./css/List.css";

export default function List({ proplist }) {
    const [tasks, setTasks] = useState([]);
    const api = useApi();
    console.log(proplist.name)
    List.defaultProps = {
        tasks: [
            { id: 1, title: 'Task 1' },
            { id: 2, title: 'Task 2' },
            { id: 3, title: 'Task 3' },
        ]
    }

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await api.get(`/lists/${proplist.id}/tasks`);
            if (response.ok) {
                setTasks(response.data);
            } else {
                console.error(response.error);
            }
        };
        fetchTasks();
    }, [proplist]); // proplist.id


    return (
        <div className="lists-container">
            {/* <p>{proplist.id}HLLO</p> */}
            <h3 className="lists-heading">{proplist.name}</h3>
            {/* TODO: this will need to make the databse call to get the tasks for the list */}
            <div>
                {/* TODO: make this work with the prop */}
                {List.defaultProps.tasks.map((task) => (
                    <Task key={task.id} className="lists-task" task={task}/>
                ))}
            </div>
        </div>
    );
}