import { useContext, useRef, useState } from 'react';
import { GlobalStateContext } from '../../../context/GlobalState';
import UserEdit from "../../models/UserEdit";


const UserInfo = () => {
    const userInfo = useContext(GlobalStateContext);
    const ref = useRef<HTMLInputElement>(null);


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
        <>
            <img src={'http://localhost/image/' + userInfo.user.image} onClick={handleImageUpdate} />
            <input ref={ref} onChange={onChangeHandler} type='file' hidden />
            <span>{userInfo.user.name}</span>
            <button onClick={() => setShowModal(true)}>Edit Profile</button>
            {showModal ? <UserEdit setShowModal={setShowModal} /> : null}
        </>
    )
}
export default UserInfo;