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


export default function WriteList({ showList, loggedInUser }) { //TODO: change showPost
    const [formErrors, setFormErrors] = useState({});
    const textField = useRef();
    const api = useApi();
    const { user } = useUser();

    const [title, setTitle] = useState('');
    const [lists, setLists] = useState([]);

    useEffect(() => {
        textField.current.focus();
    }, []);


    // const onSubmit = async (event) => {
    //     event.preventDefault();
    //     const text = textField.current.value;
    //     const response = await api.post('/lists', { text });
    //     if (response.ok) {
    //         const newList = response.data;
    //         const listId = newList.id;
    //         const userlistrelationship = { userId: loggedInUser.id, listId };
    //         await api.post('/userlistrelationships', userlistrelationship);
    //         showList(newList);
    //         textField.current.value = '';
    //     } else {
    //         if (response.body.errors) {
    //             setFormErrors(response.body.errors.json);
    //         }
    //     }
    // };

    // const onSubmit = (e) => {
        
    //     // const [type, setType] = useState('todo');
    //     e.preventDefault();
    
    //     // Create a task object from the form input
    //     const newList = {
    //       title,
    //     //   status: type, // Assuming "type" corresponds to task status
    //     };
    
    //     // Send a POST request to create a new task
    //     fetch(`${process.env.BASE_API_URL}lists`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(newList),
    //       })
    //         .then((response) => {
    //           if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //           }
    //           console.log(response)
    //           return response.text();
    //         })
    //         .then((data) => {
    //           if (data.startsWith('<!DOCTYPE')) {
    //             throw new Error('Server returned an HTML error page');
    //           }
    //           // Handle the response, e.g., show a success message
    //           console.log(data);
          
    //           // Reset form fields
    //           setTitle('');
    //         //   setType('todo');
    //         })
    //         .catch((error) => {
    //           // Handle errors, e.g., show an error message
    //           console.error('Error:', error);
    //         });
    //   };
    const BASE_API_URL = "http://127.0.0.1:5000/api"
     //process.env.REACT_APP_BASE_API_URL + '/api';
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(process.env)

        // Create a list object from the form input
        const newList = {
            title,
        };

        // Send a POST request to create a new list
        try {
            const response = await fetch(`${BASE_API_URL}/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newList),
            });
            if (response.ok) {
                const newList = await response.json();
                // Add the new list to the list of lists
                setLists((prevLists) => [...prevLists, newList]);
                // Clear the form input
                setTitle("");
            } else {
                const errors = await response.json();
                setFormErrors(errors);
            }
        } catch (error) {
            console.error(error);
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