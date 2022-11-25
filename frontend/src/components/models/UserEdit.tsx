import { GlobalStateContext } from "../../context/GlobalState";
import { useContext, useRef, useState } from 'react';
import ReactDom from "react-dom";
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import './UserEdit.css';


const UserEdit = ({ setShowModal }) => {

    const userInfo = useContext(GlobalStateContext)

    let changed = false;
    const [name, setName] = useState({ value: userInfo.user.name, changed: false });
    const [email, setEmail] = useState({ value: userInfo.user.email, changed: false });
    const [password, setPassword] = useState({ value: '', changed: false });
    const [confirmpassword, setConfirmPassword] = useState('');

    const modalRef = useRef<HTMLInputElement>(null);

    const handleEditProfile = async () => {
        if (password.value !== confirmpassword)
            return console.log(Error(`Passwords Doesn't`))
        if (name.changed === false && email.changed === false && password.changed === false)
            return console.log(Error('Nothing Changed'))
        await userInfo.editUser(name, email, password);
        blur.classList.remove('model-on');
        document.body.classList.remove('body-overflow');
        setShowModal(false);
    }

    const blur = document.getElementsByClassName('profile-page')[0];
    document.body.classList.add('body-overflow');
    blur.classList.add('model-on');

    return ReactDom.createPortal(
        <div className="container" ref={modalRef} onClick={(e) => e.target === modalRef.current && setShowModal(false)}>
            <div className="modal">
                <div className="title"><h1>Edit Profile</h1><button className="close-button" onClick={() => { setShowModal(false); blur.classList.remove('model-on'); document.body.classList.remove('body-overflow'); }}>X</button></div>
                <EditText className="edit-profile-container" inputClassName="edit-profile-container" defaultValue={name.value} onSave={(e) => {
                    e.value !== userInfo.user.name ?
                        changed = true :
                        changed = false;
                    setName({ value: e.value, changed: changed })
                }} />
                <EditText className="edit-profile-container" inputClassName="edit-profile-container" defaultValue={email.value} onSave={(e) => {
                    e.value !== userInfo.user.email ?
                        changed = true :
                        changed = false;
                    setEmail({ value: e.value, changed: true })
                }} />
                <EditText className="edit-profile-container" inputClassName="edit-profile-container" placeholder='Password' onSave={(e) => {
                    e.value.length >= 6 ?
                        setPassword({ value: e.value, changed: true }) :
                        console.log(Error('Must be greater then 6 characters'))
                }}
                    formatDisplayText={(e) => { return '*'.repeat(e.length) }} />
                <EditText className="edit-profile-container" inputClassName="edit-profile-container" placeholder='Confirm Password' onSave={(e) => { setConfirmPassword(e.value) }} formatDisplayText={(e) => { return '*'.repeat(e.length) }} />
                <button className="user-edit-btn" onClick={handleEditProfile}>Save Changes</button>
            </div>
        </div>,
        document.getElementById("user-edit") as HTMLElement
    )
}
export default UserEdit;