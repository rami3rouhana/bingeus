import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useRef } from 'react';

const UserInfo = () => {
    const userInfo = useContext(GlobalStateContext);
    const ref = useRef<HTMLInputElement>(null);

    const handleImageUpdate = () => {
        ref.current?.click();
    }

    const handleProfilePopUp = () => {

    }

    return (
        <>
            <img src={userInfo.user.image} onClick={handleImageUpdate} />
            <input ref={ref} type='file'></input>
            <button onClick={handleProfilePopUp} >Edit Profile</button>
        </>
    )
}
export default UserInfo;