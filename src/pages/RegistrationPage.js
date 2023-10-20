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
            const response = await api.post('/users', JSON.stringify(formData));
            console.log(response);
            // handle successful registration
            navigate('/login');
            console.log("Registration successful");
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



// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from '../contexts/UserProvider';
// import { useApi } from '../contexts/ApiProvider';
// import InputField from '../components/InputField';
// import { Button, Form } from 'react-bootstrap';

//     const [formErrors, setFormErrors] = useState({});
//     const usernameField = useRef();
//     const emailField = useRef();
//     const passwordField = useRef();
//     const password2Field = useRef();
//     const { register } = useUser();
//     const navigate = useNavigate();
//     const api = useApi();

//     useEffect(() => {
//         usernameField.current.focus();
//     }, []);


//     const onSubmit = async (event) => {
//         event.preventDefault();
//         register();
//         const formData = new FormData(event.target);
//         const username = formData.get('username');
//         const email = formData.get('email');
//         const password = formData.get('password');
//         const password2 = formData.get('password2');
//         const errors = {};

//         if (!username) {
//             errors.username = 'Username is required';
//         }

//         if (!email) {
//             errors.email = 'Email address is required';
//         }

//         if (!password) {
//             errors.password = 'Password is required';
//         }

//         if (!password2) {
//             errors.password2 = 'Please confirm your password';
//         }

//         if (password !== password2) {
//             errors.password2 = 'Passwords do not match';
//         }

//         if (Object.keys(errors).length > 0) {
//             setFormErrors(errors);
//             return;
//         }

//         const result = await register(username, email, password);

//         if (result.error) {
//             setFormErrors({ non_field_errors: result.error });
//         } else {
//             navigate('/login');
//         }

//         if (usernameField.current) {
//             usernameField.current.focus();
//         }
//     };

//     const validateForm = () => {
//         const errors = {};
//         if (!formData.username) {
//           errors.username = 'Username is required';
//         }
//         if (!formData.email) {
//           errors.email = 'Email is required';
//         }
//         if (!formData.password) {
//           errors.password = 'Password is required';
//         }
//         if (!formData.password2) {
//           errors.password2 = 'Confirm password is required';
//         }
//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//       };


//     return (
//         <div>
//             <h1>Register</h1>
//             <Form onSubmit={onSubmit}>
//                 <InputField
//                     name="username" label="Username" type="text"
//                     placeholder="Enter your username"
//                     value={formData.username} onChange={handleInputChange}
//                     error={formErrors.username} fieldRef={usernameField} /> 
                    
//                 <InputField
//                     name="email" label="Email address" type="email"
//                     value={formData.email} onChange={handleInputChange}
//                     error={formErrors.email} fieldRef={emailField} />
//                 <InputField
//                     name="password" label="Password" type="password"
//                     value={formData.password} onChange={handleInputChange}
//                     error={formErrors.password} fieldRef={passwordField} />
//                 <InputField
//                     name="password2" label="Confirm password" type="password"
//                     value={formData.password2} onChange={handleInputChange}
//                     error={formErrors.password2} fieldRef={password2Field} />
//                 <Button variant="primary" type="submit">Register</Button>
//             </Form>
//         </div>
//     );
// };