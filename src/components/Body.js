import { useState, useEffect, useContext } from "react";
import { useApi } from "../contexts/ApiProvider";
import "./css/Body.css";
import List from "./List";
import WriteTask from "./WriteTask";
import WriteList from "./WriteList";
import { useUser } from '../contexts/UserProvider';

export default function Body() {
    const [lists, setLists] = useState([]);
    const api = useApi();
    const { user} = useUser();

    useEffect(() => {
        const fetchLists = async () => {
            console.log("trying to load lists, loggedInUserId", user) 
            const response = await api.get(`/lists/${user}`);
            console.log("trying to load lists, respose.body", response, response.body)
            setLists(response.body);
        }
        fetchLists();
    }, [lists]); //lists    

    const showList = (newList) => {
        setLists([newList, ...lists]); 
    };

    const updateLists = async () => {
        const response = await api.get(`/lists/${user}`);
        setLists(response.body);
    };

    const handleDeleteList = async (list_id) => {
        console.log("handleDeleteList called with listId:", list_id);
        try {
            const response = await api.delete(`/lists/${list_id}`);
            console.log("response:", response);
            if (response.ok) {
                const updatedLists = lists.filter((list) => list.id !== list_id);
                setLists(updatedLists);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="body-container">
            {console.log('lists:', lists)}
            {console.log("body thinks user is", user)}
            <WriteList showList={updateLists} />
            <WriteTask prop_lists={lists}/>
            <div className="lists">
            {lists && lists.map((list) => (
                <div>
                    <List list={list} onDeleteList={handleDeleteList} />  
                </div>
            ))}
            </div>
        </div>
    );
}