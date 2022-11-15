import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef, useEffect } from 'react';

const Users = ({ socket, show }) => {
    const userInfo = useContext(GlobalStateContext);
    const [users, setUsers] = useState([]);
    socket?.on('fetch users', (msg) => {
        setUsers(msg)
    });


    return (
        <>
            {
                show === 'Users' ?
                    <>
                        <ul>
                            {
                                users?.map((user: any) => {
                                    return <li key={Math.random()}>{user.name}</li>
                                })
                            }
                        </ul>
                    </>
                    : false
            }
        </>
    )
}
export default Users;