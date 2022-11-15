import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef } from 'react';

const Playlist = ({ socket, show }) => {
    const userInfo = useContext(GlobalStateContext);

    return (
        <>
            {
                show === 'Playlist' ?
                    <>
                    </>
                    : false
            }
        </>
    )
}
export default Playlist;