import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useEffect, useState } from 'react';
import TheaterAdd from "../../models/TheaterAdd";
import Theater from "../../ui/Theater";
import AddButton from '../../assets/AddButton.svg';
import './index.css';

const UserTheaters = () => {
    const userInfo = useContext(GlobalStateContext);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getTheaters = async () => {
            await userInfo.getUserTheaters();
        }
        getTheaters();
    }, [])


    return (
        <>
            <button className="add-theater-button" onClick={() => setShowModal(true)}><img src={AddButton} /></button>
            {showModal ? <TheaterAdd setShowModal={setShowModal} /> : null}
            {userInfo.user.theaters?.map((theater: any) => {
                return <Theater key={theater._id} theater={theater} online={false} />
            })}
        </>
    )
}
export default UserTheaters;