import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import PageHeader from "../components/PageHeader";
import Body from "../components/Body";
import { useUser } from '../contexts/UserProvider';

export default function ListsPage() {
    const [user, setUser] = useState();
    const api = useApi();
    const { user: loggedInUser } = useUser();

    useEffect(() => {
        (async () => {
          const response = await api.get(`/users/${loggedInUser.user_id}/lists`);
          if (response.ok) {
            setUser(response.body);
          } else {
            setUser(null);
          }
        })();
      }, [api, loggedInUser]);
      
    return (
        <div>
            <PageHeader />
            {loggedInUser === undefined ?
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            :
                <>
                    {loggedInUser === null ?
                        <p>User not found.</p>
                    :
                    <Body loggedInUser={user} write={true}/>
                    }
                </>
            }
        </div>
    );
}
