import { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";

export default function MoveTaskForm({ task, onMove}) {
    const [lists, setLists] = useState([]);
    const [destinationList, setDestinationList] = useState(null);

    const api = useApi();
    const { user} = useUser();

    useEffect(() => {
        const fetchLists = async () => {
            console.log("trying to load lists, loggedInUserId", user) // TODO: the issue is that this is not defined
            const response = await api.get(`/lists/${user}`);
            console.log("trying to load lists, respose.body", response, response.body)
            setLists(response.body);
        }
        fetchLists();
    }, []);//lists  

    const handleMove = () => {
        onMove(destinationList.id);
    };

    return (
        <div className="move-task-form">
            <select
                value={destinationList ? destinationList.id : ""}
                onChange={(event) =>
                    setDestinationList(
                        lists.find((list) => list.id === parseInt(event.target.value))
                    )
                }
            >
                <option value="">Select list</option>
                {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                        {list.title}
                    </option>
                ))}
            </select>
            <button onClick={handleMove}>Move</button>
        </div>
    );
}