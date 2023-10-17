import { useState, useEffect, useContext } from "react";
import { useApi } from "../contexts/ApiProvider";
import "./css/Body.css";
import Lists from "./List";
import WriteTask from "./WriteTask";

export default function Body({ userId, write }) {
    const [lists, setLists] = useState([]);
    const api = useApi();

    useEffect(() => {
        (async () => {
            const response = await api.get(`/users/${userId}/lists`);
            if (response.ok) {
                setLists(response.body.data);
            } else {
                console.log(response.error);
            }
        })();
    }, [api, userId]);

    const showTask = (newTask) => {
        setTasks([newTask, ...tasks]); //TODO: need to make this add to the write user's list and everything
    };

    return (
        <div className="body-container">
            {write && <Write showTask={showTask} />}
            {lists.map((list) => (
                <Lists key={list.id} list={list} />
            ))}
        </div>
    );
}