import { useState, useEffect, useRef } from 'react';
import Stack from "react-bootstrap/Stack";
import Form from 'react-bootstrap/Form';
import InputField from './InputField';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import "./css/WriteList.css";
// import CORS from "flask-cors";

// CORS(app, support_credentials=True)

// import dotenv from "dotenv";
// dotenv.config();


export default function WriteList({ showList }) { //TODO: change showPost
    const [formErrors, setFormErrors] = useState({});
    const textField = useRef();
    const api = useApi();
    const { user } = useUser();

    const [title, setTitle] = useState('');
    const [lists, setLists] = useState([]);

    useEffect(() => {
        textField.current.focus();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        const title = textField.current.value;
        const response = await api.post('/lists', { title });
        if (response.ok) {
            const newList = response.body;
            console.log("new list response", newList);
            const listId = newList.list_id;
            const userlistrelationship = { userId: user, listId: listId };
            const list_response = await api.post('/connecttolist', userlistrelationship);
            if (list_response.success) {
                showList(newList); //should this be the id?
                textField.current.value = '';
            }
            
        } else {
            if (response.body.errors) {
                setFormErrors(response.body.errors.json);
            }
        }
    };

    return (
        <Stack direction="horizontal" gap={3} className="WriteList">
           { console.log("write list thinkgs user is", user)}
            <Form onSubmit={onSubmit}>
                <InputField
                name="text" label="add new list" placeholder="Add list"
                error={formErrors.text} fieldRef={textField} />
                <button type="submit">Create</button>
            </Form>
        </Stack>
    );
}