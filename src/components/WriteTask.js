import { useState, useEffect, useRef } from 'react';
import Stack from "react-bootstrap/Stack";
import Form from 'react-bootstrap/Form';
import InputField from './InputField';
import { Dropdown } from '@fluentui/react';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import "./css/WriteTask.css";

export default function WriteTask({ showTask }) { //TODO: change showPost
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const textField = useRef();
    const api = useApi();
    const { user } = useUser();

    useEffect(() => {
        textField.current.focus();
    }, []);

    useEffect(() => {
        const fetchLists = async () => {
          const response = await api.get("/lists");
          if (response.ok) {
            setLists(response.data);
          } else {
            console.error(response.error);
          }
        };
        fetchLists();
      }, []);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const response = await api.post("/newtask", { //TODO: route may not be right
        text: textField.current.value
        });
        if (response.ok) {
            showTask(response.body);
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
                <InputField name="text" label="add new task" placeholder="Add task"
                            error={formErrors.text} fieldRef={textField} />
                <Dropdown
                    label="Select list"
                    options={lists.map((list) => ({
                        key: list.id,
                        text: list.title,
                        data: list,
                    }))}
                    selectedKey={selectedList ? selectedList.id : undefined}
                    onChange={(event, option) => setSelectedList(option.data)}
                />
                <button type="submit">Create</button>
            </Form>
        </Stack>
    );
}