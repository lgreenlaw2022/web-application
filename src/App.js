import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ListsPage from "./pages/ListsPage";
import LoginPage from "./pages/LoginPage";
import ApiProvider from "./contexts/ApiProvider";
import RegistrationPage from "./pages/RegistrationPage";
import UserProvider from "./contexts/UserProvider";
import "./App.css";

export default function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<ApiProvider>
					<UserProvider>
						<Header />
						<Routes>
							{/* route to login page first */}
							<Route path="/login" element={<LoginPage />} />
							<Route
								path="/register"
								element={<RegistrationPage />}
							/>
							<Route path="/lists" element={<ListsPage />} />
							{/* default route to login page */}
							<Route
								path="*"
								element={<Navigate to="/login" />}
							/>
						</Routes>
					</UserProvider>
				</ApiProvider>
			</BrowserRouter>
		</div>
	);
}
