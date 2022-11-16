import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef } from 'react';

const Playlist = ({ playlist, setUrl, movieSocket, show }) => {

    return (
        <>
            {
                show === 'Playlist' ?
                    <>
                        {
                            playlist.map(movie => {
                                return <div key={movie._id} onClick={(e) => { setUrl(movie.url); movieSocket.emit('handle change', movie.url) }}>{movie.name}</div>
                            })}
                    </>
                    : false
            }
        </>
    )
}
export default Playlist;