import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ListsPage from "./pages/ListsPage";
import LoginPage from "./pages/LoginPage";
import ApiProvider from "./contexts/ApiProvider";
import RegistrationPage from "./pages/RegistrationPage";
import UserProvider from "./contexts/UserProvider";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <ApiProvider>
                    <UserProvider>
                        <Header />
                        <Routes>
                            {console.log("Rendering route component")}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegistrationPage />} />
                            <Route path="/lists" element={<ListsPage />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    </UserProvider>
                </ApiProvider>
            </BrowserRouter>
        </div>
    );
}
