import { useState, useEffect, useRef } from "react";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import InputField from "./InputField";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import "./css/WriteList.css";

export default function WriteList({ showList }) {
    const [formErrors, setFormErrors] = useState({});
    const textField = useRef();
    const api = useApi();
    const { user } = useUser();

    useEffect(() => {
        textField.current.focus();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        const title = textField.current.value;
        const response = await api.post("/lists", { title });
        if (response.ok) {
        const newList = response.body[0];
        console.log("new list response", newList, newList.list_id);
        const list_Id = newList.list_id;
        const user_Id = user;
        const list_response = await api.post("/connecttolist", {
            user_id: user_Id,
            list_id: list_Id,
        });
        console.log("list response", list_response);
        if (list_response.body.success) {
            console.log("updating lists list");
            showList();
            textField.current.value = "";
        }
        } else {
        if (response.body.errors) {
            setFormErrors(response.body.errors.json);
        }
        }
    };

    return (
        <Stack direction="horizontal" gap={3} className="WriteList">
        {console.log("write list thinkgs user is", user)}
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
