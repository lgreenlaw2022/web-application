import { useState, useEffect, useContext } from "react";
import { useApi } from "../contexts/ApiProvider";
import List from "./List";
import WriteTask from "./WriteTask";
import WriteList from "./WriteList";
import { useUser } from "../contexts/UserProvider";
import "./css/Body.css";

export default function Body() {
	// Declare a state variable to store the lists
	const [lists, setLists] = useState([]);
	// Get the api from the context
	const api = useApi();
	// Get the user from the context
	const { user } = useUser();

	// Fetch the lists from the api when the lists state is updated
	useEffect(() => {
		const fetchLists = async () => {
			console.log("trying to load lists, loggedInUserId", user);
			const response = await api.get(`/lists/${user}`);
			console.log(
				"trying to load lists, respose.body",
				response,
				response.body
			);
			setLists(response.body);
		};
		fetchLists();
	}, [lists]);

	// Update the lists from the api when the user is updated
	const updateLists = async () => {
		const response = await api.get(`/lists/${user}`);
		setLists(response.body);
	};

	// Handle the delete of a list
	const handleDeleteList = async (list_id) => {
		console.log("handleDeleteList called with listId:", list_id);
		try {
			const response = await api.delete(`/lists/${list_id}`);
			console.log("response:", response);
			if (response.ok) {
				const updatedLists = lists.filter(
					(list) => list.id !== list_id
				);
				setLists(updatedLists);
			} else {
				console.error(response.error);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="body-container">
			{console.log("lists:", lists)}
			{console.log("body thinks user is", user)}
			<WriteList showList={updateLists} />
			<WriteTask prop_lists={lists} />
			<div className="lists">
				{lists &&
					lists.map((list) => (
						<div>
							<List list={list} onDeleteList={handleDeleteList} />
						</div>
					))}
			</div>
		</div>
	);
}
