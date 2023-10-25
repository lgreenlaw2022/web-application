import React, { useState } from 'react';
import InputField from '../components/InputField';
import { useApi } from '../contexts/ApiProvider';
// import { useHistory } from 'react-router';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
    const api = useApi();
    // const history = useHistory();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateForm();
        if (isValid) {
        try {
            const response = await api.post('/auth/register', JSON.stringify(formData));
            console.log(response);
            // handle successful registration
            // navigate('/login');
            console.log("Registration successful");
            let next = '/login';
            // if (location.state && location.state.next) {
            //     next = location.state.next;
            // }
            navigate(next);
        } catch (error) {
            console.error(error);
            console.log("Registration failed");
            // handle registration error
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error;
                setFormErrors({ server: errorMessage });
            } else {
                setFormErrors({ server: 'Unknown error' });
            }
        }
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.username) {
            errors.username = 'Username is required';
        }
        if (!formData.email) {
            errors.email = 'Email is required';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirm password is required';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <InputField
                    name="username"
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={formErrors.username}
                    // TODO: add fieldRefs
                />
                <InputField
                    name="email"
                    label="Email address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={formErrors.email}
                />
                <InputField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={formErrors.password}
                />
                <InputField
                    name="confirmPassword"
                    label="Confirm password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={formErrors.confirmPassword}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}