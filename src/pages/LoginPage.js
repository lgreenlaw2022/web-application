import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { Button, Form, Alert} from 'react-bootstrap';
import UserProvider from '../contexts/UserProvider';
import { useApi } from '../contexts/ApiProvider';

export default function LoginPage() {
    const [formErrors, setFormErrors] = useState({});
    // const { login } = useUser();
    // const { location } = useUser();
    const navigate = useNavigate();
    const usernameField = useRef(null);
    const passwordField = useRef(null);
    // const user = useUser();
    const { user, login, logout } = useUser();
    const api = useApi();


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

        const result = await login(username, password); //changed this from going directly to login
        // Set the current user in the UserProvider component
        
        console.log("login submit rtesutl", result)

        //TODO: need to make a get request hrz
        if (result === undefined) {
            console.log("result is undefined")
        }
        else if ( result.error) {
            setFormErrors({ non_field_errors: result.error });
        } else {
            setFormErrors({});
            // UserProvider.set_current_user(user.id)
            let next = '/';
            // if (location.state && location.state.next) {
            //     next = location.state.next;
            // }
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
            {formErrors.non_field_errors === 'No account found with that username or email address' && (
                <Alert variant="warning">No account found with that username or email address. Please register.</Alert>
            )}
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