import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { Button, Form} from 'react-bootstrap';

export default function LoginPage() {
    const [formErrors, setFormErrors] = useState({});
    const { login } = useUser();
    const { location } = useUser();
    const navigate = useNavigate();
    const usernameField = useRef(null);
    const passwordField = useRef(null);

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

        if (result.error) {
            setFormErrors({ non_field_errors: result.error });
        } else {
            let next = '/';
            if (location.state && location.state.next) {
                next = location.state.next;
            }
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
        <div>
            <h1>Login</h1>
            <Form onSubmit={onSubmit}>
                <InputField
                    name="username" label="Username or email address"
                    error={formErrors.username} fieldRef={usernameField} />
                <InputField
                    name="password" label="Password" type="password"
                    error={formErrors.password} fieldRef={passwordField} />
                <Button variant="primary" type="submit">Login</Button>
            </Form>
            <hr />
            <p>Don&apos;t have an account? <Link to="/register">Register here</Link>!</p>
        </div>
    );
};