import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import PageHeader from "../components/PageHeader";
import Body from "../components/Body";
import { useUser } from '../contexts/UserProvider';

export default function ListsPage() {
    // const [user, setUser] = useState();
    const api = useApi();
    const { user } = useUser();
      
    return (
        <div>
            {console.log('rendering ListsPage component')}
            <PageHeader />
            {console.log('user', user)}
            {user === undefined ?
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            :
                <>
                    {user === null ?
                        <p>User not found.</p>
                    :
                    <Body loggedInUser={user} write={true}/>
                    }
                </>
            }
        </div>
    );
}
