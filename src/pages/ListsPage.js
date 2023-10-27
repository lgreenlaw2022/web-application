import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import PageHeader from "../components/PageHeader";
import Body from "../components/Body";
import UserProvider from '../contexts/UserProvider';
import { useUser } from '../contexts/UserProvider';
import { useNavigate, Link } from 'react-router-dom';

export default function ListsPage() {
    // const [user, setUser] = useState();
    const api = useApi();
    const { user } = useUser();
      
    return (
        <div>
            {console.log('rendering ListsPage component for user', user)}
            <PageHeader />
            {console.log('user', user)}
            {user === undefined ?
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            :
                <>
                    {user === null ?
                        <p>User not found. <Link to="/login">Login</Link></p>
                    :
                    <Body loggedInUser={user} write={true}/>
                    }
                </>
            }
        </div>
    );
}
