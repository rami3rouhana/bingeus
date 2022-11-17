import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef, useEffect } from 'react';

const Users = ({ socket, show }) => {
    const userInfo = useContext(GlobalStateContext);
    const [users, setUsers] = useState([]);

    socket?.on('connect', () => {
        socket?.emit('fetch users');
        socket?.on('receive users', (users) => {
            setUsers(users);
        })
    })

    socket?.on('receive users', (users) => {
        setUsers(users);
    })

    return (
        <>
            {
                show === 'Users' ?
                    <>
                        <ul>
                            {
                                users?.map((user: any) => {
                                    if (user !== null)
                                        return (<li key={Math.random()}><img src={`http://localhost/image/${user.image}`}/>{user.name}<button onClick={(e: any) => { socket?.emit('block', user.id); e.currentTarget.parentElement.remove() }}>block</button></li>)
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