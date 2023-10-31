import { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";

export default function MoveTaskForm({ onMove }) {
	const [lists, setLists] = useState([]);
	//destinationList is the list that the user is moving the task to
	const [destinationList, setDestinationList] = useState(null);

	//api is the api that is used to make requests to the backend
	const api = useApi();
	//user is the logged in user
	const { user } = useUser();

	//this effect is used to fetch the lists that the user has access to
	useEffect(() => {
		const fetchLists = async () => {
			const response = await api.get(`/lists/${user}`);
			setLists(response.body);
		};
		fetchLists();
	}, [lists]);

	//this function is used to move the task to the destination list
	// calls the onMove function that is passed in as a prop from the task component
	const handleMove = () => {
		onMove(destinationList.id);
	};

	return (
		<div className="move-task-form">
			<select
				value={destinationList ? destinationList.id : ""}
				onChange={(event) =>
					setDestinationList(
						lists.find(
							(list) => list.id === parseInt(event.target.value)
						)
					)
				}
			>
				<option value="">Select list</option>
				{/* shows list of tasks in dropdown */}
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
