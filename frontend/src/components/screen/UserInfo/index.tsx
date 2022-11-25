import { useContext, useRef, useState } from 'react';
import { GlobalStateContext } from '../../../context/GlobalState';
import UserEdit from "../../models/UserEdit";
import './index.css';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
    const userInfo = useContext(GlobalStateContext);
    const ref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const handleImageUpdate = () => {
        ref.current?.click();
    }
    const onChangeHandler = async (e: any) => {
        const image = new FormData();
        image.append('file', e.target.files[0]);
        await userInfo.uploadImage(image);
    }

    return (
        <div className='user-info'>
            <img className='user-profile-img' src={'http://localhost/image/' + userInfo.user.image} onClick={handleImageUpdate} />
            <input ref={ref} onChange={onChangeHandler} type='file' hidden />
            <span className='profile-display-name'>{userInfo.user.name}</span>
            <button className='user-edit-btn' onClick={() => setShowModal(true)}>Edit Profile</button>
            {showModal ? <UserEdit setShowModal={setShowModal} /> : null}
        </div>
    )
}
export default UserInfo;