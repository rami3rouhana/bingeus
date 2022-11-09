import { useContext, useRef, useState } from 'react';
import { GlobalStateContext } from '../../../context/GlobalState';
import UserEdit from "../Models/UserEdit";


const UserInfo = () => {
    const userInfo = useContext(GlobalStateContext);
    const ref = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false);

    const handleImageUpdate = () => {
        ref.current?.click();
    }

    return (
        <>
            <img src={userInfo.user.image} onClick={handleImageUpdate} />
            <input ref={ref} type='file' hidden/>
            <span>{userInfo.user.name}</span>
            <button onClick={() => setShowModal(true)}>Edit Profile</button>
            {showModal ? <UserEdit setShowModal={setShowModal} /> : null}
        </>
    )
}
export default UserInfo;