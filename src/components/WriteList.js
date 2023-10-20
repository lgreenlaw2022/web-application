import { useState, useEffect, useRef } from 'react';
import Stack from "react-bootstrap/Stack";
import Form from 'react-bootstrap/Form';
import InputField from './InputField';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import "./css/WriteList.css";


export default function WriteList({ showList, loggedInUser }) { //TODO: change showPost
    const [formErrors, setFormErrors] = useState({});
    const textField = useRef();
    const api = useApi();
    const { user } = useUser();

    useEffect(() => {
        textField.current.focus();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        const text = textField.current.value;
        const response = await api.post('/lists', { text });
        if (response.ok) {
            const newList = response.data;
            const listId = newList.id;
            const userlistrelationship = { userId: loggedInUser.id, listId };
            await api.post('/userlistrelationships', userlistrelationship);
            showList(newList);
            textField.current.value = '';
        } else {
            if (response.body.errors) {
                setFormErrors(response.body.errors.json);
            }
        }
    };

    return (
        <Stack direction="horizontal" gap={3} className="WriteList">
            <Form onSubmit={onSubmit}>
                <InputField
                name="text" label="add new list" placeholder="Add list"
                error={formErrors.text} fieldRef={textField} />
                <button type="submit">Create</button>
            </Form>
        </Stack>
    );
}