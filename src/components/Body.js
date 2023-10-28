import { useState, useEffect, useContext } from "react";
import { useApi } from "../contexts/ApiProvider";
import "./css/Body.css";
import List from "./List";
import WriteTask from "./WriteTask";
import WriteList from "./WriteList";
import { useUser } from '../contexts/UserProvider';
import ApiClient from "../ApiClient";
import { UserContext } from "../contexts/UserProvider";

// const list1 = ['item1', 'item2', 'item3'];
// const list2 = ['item4', 'item5', 'item6'];
// const list3 = ['item7', 'item8', 'item9'];

// const default_lists = [
//     { name: 'List 1', items: ['item1', 'item2', 'item3'] },
//     { name: 'List 2', items: ['item4', 'item5', 'item6'] },
//     { name: 'List 3', items: ['item7', 'item8', 'item9'] },
// ];

export default function Body() {
    const [lists, setLists] = useState([]);
    const api = useApi();
    const { user} = useUser();
    // const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchLists = async () => {
            console.log("trying to load lists, loggedInUserId", user) // TODO: the issue is that this is not defined
            const response = await api.get(`/lists/${user}`);
            console.log("trying to load lists, respose.body", response, response.body)
            setLists(response.body);
        }
        fetchLists();
    }, [lists]);    

    const showList = (newList) => {
        setLists([newList, ...lists]); //TODO: need to make this add to the write user's list and everything
    };

    const updateLists = async () => {
        const response = await api.get(`/lists/${user}`);
        setLists(response.body);
    };
    
    // console.log('user', Body.defaultProps.loggedInUser)
    // console.log("df users", !Body.defaultProps.def_lists)
    return (
        <div className="body-container">
            {console.log('lists:', lists)}
            {console.log("body thinks user is", user)}
            <WriteList showList={updateLists} />
            <WriteTask prop_lists={lists}/>
            {lists && lists.map((list) => (
                <div>
                    <List list={list} />  
                </div>
            ))}
        </div>
    );
}