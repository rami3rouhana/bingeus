import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext } from 'react';
import UnblockButton from '../../assets/UnblockButton.svg';
import './index.css';

const BlockList = () => {
    const userInfo = useContext(GlobalStateContext);
    return (
        <div className="blocked-list-profile">
            <span className='block-title'>Blocked List</span>
            <ul className="blocked-list">
                {userInfo.user.blockedList.map((user: any) => {
                    return (
                        <li key={user._id}>
                            <img src={'http://localhost/image/' + user.image} />
                            <span>{user.name}</span>
                            <button onClick={async () => await userInfo.unblock(user.userId)}><img src={UnblockButton} /></button>
                        </li>)
                })}
            </ul>
        </div>
    )
}
export default BlockList;