import { useUser } from '../contexts/UserProvider';
import { useNavigate } from 'react-router-dom';
import './css/Header.css';


export default function Header() {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
         <div className="header">
            <h1 className="logo">Taski</h1>
            {user && (
                <button classname="logout-button" onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
}





        