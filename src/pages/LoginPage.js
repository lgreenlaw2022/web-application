import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import InputField from '../components/InputField';
import { Button, Form, Alert } from 'react-bootstrap';
import '../components/css/LoginPage.css'; //TODO: move this to css for pages


const LoginPage = () => {
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const usernameField = useRef(null);
    const passwordField = useRef(null);
    const { login, logout } = useUser();

    useEffect(() => {
        console.log("signing the user out just in case");
        logout();

        if (usernameField.current) {
            usernameField.current.focus();
        }
    }, [logout]);

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const errors = {};

        if (!username) {
            errors.username = 'Username or email address is required';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const result = await login(username, password);

        console.log("login submit result", result);

        if (result === undefined || !result.success) {
            console.log("result is undefined");
            const error = result.message;
            setFormErrors({ password: 'Invalid username or password' });
            console.error(error);
        }

        if (result.success) {
            let next = '/lists';
            console.log('next', next);
            navigate(next);
        }

        if (usernameField.current) {
            usernameField.current.focus();
        }

        if (passwordField.current) {
            passwordField.current.focus();
        }
    };

    return (
        <div className="login-container"> 
            <h1 className="login-header">Login</h1>
            {formErrors.non_field_errors === 'No account found with that username or email address' && (
                <Alert variant="warning">
                    No account found with that username or email address. Please register.
                </Alert>
            )}
            <Form onSubmit={onSubmit}>
                <InputField
                    name="username"
                    label="Username or email address"
                    error={formErrors.username}
                    fieldRef={usernameField}
                />
                <InputField
                    name="password"
                    label="Password"
                    type="password"
                    error={formErrors.password}
                    fieldRef={passwordField}
                />
                <Button variant="primary" type="submit">Login</Button>
            </Form>
            <hr />
            <p>Don't have an account?
                <Link to="/register">Register here</Link>!
            </p>
        </div>
    );
};

export default LoginPage;
