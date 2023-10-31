import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import InputField from "../components/InputField";
import { Button, Form } from "react-bootstrap";
import "./css/LoginPage.css";

const LoginPage = () => {
	const [formErrors, setFormErrors] = useState({});
	const navigate = useNavigate();
	const usernameField = useRef(null);
	const passwordField = useRef(null);
	// import user management functions from UserProvider
	const { login, logout } = useUser();

	// This effect is called when the user logs out
	useEffect(() => {
		logout();

		// If the username field is available, focus it
		if (usernameField.current) {
			usernameField.current.focus();
		}
	}, [logout]);

	// This function is called when the form is submitted
	const onSubmit = async (event) => {
		// Prevent the default action of the form
		event.preventDefault();
		// Create a form data object from the form
		const formData = new FormData(event.target);
		// Get the username and password from the form
		const username = formData.get("username");
		const password = formData.get("password");
		const errors = {};

		// If the username field is empty, add an error
		if (!username) {
			errors.username = "Username or email address is required";
		}

		// If the password field is empty, add an error
		if (!password) {
			errors.password = "Password is required";
		}

		// If there are any errors, set the form errors and return
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		// No imput errors: Call the login function with the username and password
		const result = await login(username, password);

		// If the login function returns an error, set the form errors and log the error
		if (result === undefined || !result.success) {
			const error = result.message;
			setFormErrors({ password: "Invalid username or password" });
			console.error(error);
		}

		// on login success, navigate to lists page
		if (result.success) {
			let next = "/lists";
			navigate(next);
		}

		if (usernameField.current) {
			usernameField.current.focus();
		}

		if (passwordField.current) {
			passwordField.current.focus();
		}
	};

	// Return the login page
	return (
		<div className="login-container">
			<h1 className="login-header">Login</h1>
			{/* {formErrors.non_field_errors ===
				"No account found with that username or email address" && (
				<Alert variant="warning">
					No account found with that username or email address. Please
					register.
				</Alert>
			)} */}
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
				<Button variant="primary" type="submit">
					Login
				</Button>
			</Form>
			<hr />
			<p>
				Don't have an account?
				<Link to="/register">Register here</Link>!
			</p>
		</div>
	);
};

export default LoginPage;
