import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef, useEffect } from 'react';
import './index.css';
import Block from '../../assets/Block.svg';

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
                                        return (<li key={Math.random()}><img className="user-img" src={`http://localhost/image/${user.image}`} />{user.name}<button className="block-button" onClick={(e: any) => { socket?.emit('block', user.id); e.currentTarget.parentElement.remove() }}><img src={Block} /></button></li>)
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