import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useEffect, useState } from 'react';
import TheaterAdd from "../Models/TheaterAdd";

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
            <button onClick={() => setShowModal(true)}>+</button>
            {showModal ? <TheaterAdd setShowModal={setShowModal} /> : null}
            {userInfo.user.theaters?.map((theater: any) => {
                return <div key={theater._id}><img src={theater.showing.poster} />{theater.showing.title}<p>{theater.showing.description}</p></div>
            })}

        </>
    )
}
export default UserTheaters;