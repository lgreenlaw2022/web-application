import { useState, useEffect, useContext } from "react";
import { useApi } from "../contexts/ApiProvider";
import "./css/Body.css";
import List from "./List";
import WriteTask from "./WriteTask";
import WriteList from "./WriteList";
import { useUser } from '../contexts/UserProvider';

const list1 = ['item1', 'item2', 'item3'];
const list2 = ['item4', 'item5', 'item6'];
const list3 = ['item7', 'item8', 'item9'];

const default_lists = [
    { name: 'List 1', items: ['item1', 'item2', 'item3'] },
    { name: 'List 2', items: ['item4', 'item5', 'item6'] },
    { name: 'List 3', items: ['item7', 'item8', 'item9'] },
];

export default function Body({ loggedInUser}) {
    // TODO: delete
    Body.defaultProps = {
        loggedInUser: {
          user_id: 0,
          username: 'guest',
          email: 'guest@example.com',
        },
        def_lists: [
            { id: '1', name: 'List 1', items: ['item1', 'item2', 'item3'] },
            { id: '2', name: 'List 2', items: ['item4', 'item5', 'item6'] },
            { id: '3', name: 'List 3', items: ['item7', 'item8', 'item9'] },
        ]
    };
    
    const [lists, setLists] = useState(default_lists); // TODO: default should be []
    
    // const [user, setUser] = useState();
    // const api = useApi();
    // const { user: loggedInUser } = useUser();

    // useEffect(() => {
    //     (async () => {
    //       const response = await api.get(`/users/${loggedInUser.user_id}/lists`);
    //       if (response.ok) {
    //         setUser(response.body);
    //       } else {
    //         setUser(null);
    //       }
    //     })();
    //   }, [api, loggedInUser]);

    
    

    const showList = (newList) => {
        setLists([newList, ...lists]); //TODO: need to make this add to the write user's list and everything
    };

    console.log('lists:', lists);
    console.log('user', Body.defaultProps.loggedInUser)
    console.log("df users", !Body.defaultProps.def_lists)
    return (
        <div className="body-container">
            <WriteList showList={showList} loggedInUser={loggedInUser}/>
            <WriteTask/>
            <p>hello {Body.defaultProps.loggedInUser.username}</p>
            {Body.defaultProps.def_lists && Body.defaultProps.def_lists.map((def_list) => (
                <div>
                    <List proplist={def_list} user={loggedInUser} /> {/* onTaskMove={moveTask} */}
                    
                </div>
            ))}
        </div>
    );
}