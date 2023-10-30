import { useUser } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import "./css/Header.css";

export default function Header() {
	// Get user from context
	const { user, logout } = useUser();
	// Get navigate function from react-router-dom
	const navigate = useNavigate();

	// Create logout function
	const handleLogout = () => {
		// Call logout function from context
		logout();
		// Call navigate function from react-router-dom
		navigate("/login");
	};

	// Render header
	return (
		<div className="header">
			<h1 className="logo">Taski</h1>
			{user && (
				// Render logout button if user is logged in
				<button classname="logout-button" onClick={handleLogout}>
					Logout
				</button>
			)}
		</div>
	);
}
