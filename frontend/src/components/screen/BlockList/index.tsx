import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext } from 'react';

const BlockList = () => {
    const userInfo = useContext(GlobalStateContext);
    return (
        <>
            <ul>
                {userInfo.user.blockedList.map((user: any) => {
                    return (
                        <li key={user._id}>
                            <img src={user.image} />
                            <span>{user.name}</span>
                            <button onClick={async () => await userInfo.unblock(user.userId)}>Unblock</button>
                        </li>)
                })}
            </ul>
        </>
    )
}
export default BlockList;