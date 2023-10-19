import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import { useApi } from '../contexts/ApiProvider';
import InputField from '../components/InputField';
import { Button, Form } from 'react-bootstrap';

export default function RegistrationPage() {
    const [formErrors, setFormErrors] = useState({});
    const usernameField = useRef();
    const emailField = useRef();
    const passwordField = useRef();
    const password2Field = useRef();
    const { register } = useUser();
    const navigate = useNavigate();
    const api = useApi();

    useEffect(() => {
        usernameField.current.focus();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const password2 = formData.get('password2');
        const errors = {};

        if (!username) {
            errors.username = 'Username is required';
        }

        if (!email) {
            errors.email = 'Email address is required';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        if (!password2) {
            errors.password2 = 'Please confirm your password';
        }

        if (password !== password2) {
            errors.password2 = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const result = await register(username, email, password);

        if (result.error) {
            setFormErrors({ non_field_errors: result.error });
        } else {
            navigate('/login');
        }

        if (usernameField.current) {
            usernameField.current.focus();
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <Form onSubmit={onSubmit}>
                <InputField
                    name="username" label="Username"
                    error={formErrors.username} fieldRef={usernameField} />
                <InputField
                    name="email" label="Email address" type="email"
                    error={formErrors.email} fieldRef={emailField} />
                <InputField
                    name="password" label="Password" type="password"
                    error={formErrors.password} fieldRef={passwordField} />
                <InputField
                    name="password2" label="Confirm password" type="password"
                    error={formErrors.password2} fieldRef={password2Field} />
                <Button variant="primary" type="submit">Register</Button>
            </Form>
        </div>
    );
};