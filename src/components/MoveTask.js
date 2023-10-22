import { useState, useEffect } from "react";

export default function MoveTaskForm({ task, onMove, onCancel }) {
    const [lists, setLists] = useState([]);
    const [destinationList, setDestinationList] = useState(null);

    useEffect(() => {
        // Fetch the list of lists from the server
        const fetchLists = async () => {
            try {
                const response = await fetch(`${process.env.BASE_API_URL}lists`);
                if (response.ok) {
                    const lists = await response.json();
                    setLists(lists);
                } else {
                    console.error("Failed to fetch lists");
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchLists();
    }, []);

    const handleMove = () => {
        onMove(destinationList.id);
        onCancel();
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
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}