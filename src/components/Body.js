import { useState, useEffect, useContext } from "react";
import { useApi } from "../contexts/ApiProvider";
import "./css/Body.css";
import Lists from "./List";
import WriteTask from "./WriteTask";
import WriteList from "./WriteList";
import { useUser } from '../contexts/UserProvider';

export default function Body({ loggedInUser, write }) {
    const [lists, setLists] = useState([]);
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

    return (
        <div className="body-container">
            {write && <WriteList showList={showList} />}
            {lists.map((list) => (
                <Lists key={list.id} list={list} user={loggedInUser}/>
            ))}
        </div>
    );
}