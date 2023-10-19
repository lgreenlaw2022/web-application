import { useState, useEffect, useRef } from 'react';
import Stack from "react-bootstrap/Stack";
import Form from 'react-bootstrap/Form';
import InputField from './InputField';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';

export default function WriteList({ showList }) { //TODO: change showPost
    const [formErrors, setFormErrors] = useState({});
    const textField = useRef();
    const api = useApi();
    const { user } = useUser();

    useEffect(() => {
        textField.current.focus();
    }, []);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const response = await api.post("/newlist", { //TODO: route may not be right
        text: textField.current.value
        });
        if (response.ok) {
        showList(response.body);
        textField.current.value = '';
        }
        else {
        if (response.body.errors) {
            setFormErrors(response.body.errors.json);
        }
        }
    };

    return (
        <Stack direction="horizontal" gap={3} className="WriteTask">
            <Form onSubmit={onSubmit}>
                <InputField
                name="text" placeholder="Add list"
                error={formErrors.text} fieldRef={textField} />
            </Form>
        </Stack>
    );
}