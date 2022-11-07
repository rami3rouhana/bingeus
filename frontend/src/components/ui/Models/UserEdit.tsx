import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useRef, useState } from 'react';
import ReactDom from "react-dom";
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';


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
        setShowModal(false);
    }


    return ReactDom.createPortal(
        <div className="container" ref={modalRef} onClick={(e) => e.target === modalRef.current && setShowModal(false)}>
            <div className="modal">
                <button onClick={() => setShowModal(false)}>X</button>
                <EditText showEditButton defaultValue={name.value} onSave={(e) => {
                    e.value !== userInfo.user.name ?
                        changed = true :
                        changed = false;
                    setName({ value: e.value, changed: changed })
                }} />
                <EditText showEditButton defaultValue={email.value} onSave={(e) => {
                    e.value !== userInfo.user.email ?
                        changed = true :
                        changed = false;
                    setEmail({ value: e.value, changed: true })
                }} />
                <EditText showEditButton placeholder='Password' onSave={(e) => {
                    e.value.length >= 6 ?
                        setPassword({ value: e.value, changed: true }) :
                        console.log(Error('Must be greater then 6 characters'))
                }}
                    formatDisplayText={(e) => { return '*'.repeat(e.length) }} />
                <EditText showEditButton placeholder='Confirm Password' onSave={(e) => { setConfirmPassword(e.value) }} formatDisplayText={(e) => { return '*'.repeat(e.length) }} />
                <button onClick={handleEditProfile}>Save Changes</button>
            </div>
        </div>,
        document.getElementById("user-edit") as HTMLElement
    )
}
export default UserEdit;