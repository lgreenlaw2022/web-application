import { useState, useEffect, useRef } from "react";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import InputField from "./InputField";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import "./css/WriteList.css";

export default function WriteList({ showList }) {
	// set up form errors
	const [formErrors, setFormErrors] = useState({});
	// set up text field
	const textField = useRef();
	// get api
	const api = useApi();
	// get user
	const { user } = useUser();

	// focus on text field
	useEffect(() => {
		textField.current.focus();
	}, []);

	const onSubmit = async (event) => {
		event.preventDefault();
		// get title from text field
		const title = textField.current.value;
		// make a new list post to api
		const response = await api.post("/lists", { title });
		if (response.ok) {
			const newList = response.body[0];
			const list_Id = newList.list_id;
			const user_Id = user;
			// connect to list to user
			const list_response = await api.post("/connecttolist", {
				user_id: user_Id,
				list_id: list_Id,
			});
			if (list_response.body.success) {
				showList();
				textField.current.value = "";
			}
		} else {
			// if response is not ok
			if (response.body.errors) {
				// set form errors
				setFormErrors(response.body.errors.json);
			}
		}
	};

	return (
		<Stack direction="horizontal" gap={3} className="WriteList">
			<Form onSubmit={onSubmit}>
				<InputField
					name="text"
					label="add new list"
					placeholder="Add list"
					error={formErrors.text}
					fieldRef={textField}
				/>
				<button type="submit">Create</button>
			</Form>
		</Stack>
	);
}
