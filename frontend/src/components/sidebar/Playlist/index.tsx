import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef } from 'react';
import './index.css';
import PlaylistButton from '../../assets/PlaylistButton.svg';

const Playlist = ({ playlist, setUrl, movieSocket, show }) => {

    return (
        <>
            {
                show === 'Playlist' ?
                    <div className='theater-playlist'>
                        {
                            playlist.map(movie => {
                                return <div className="playlist-movies" key={movie._id} onClick={(e) => { setUrl(movie.url); movieSocket.emit('handle change', movie.url) }}><img src={PlaylistButton} className="playlist-img"/>{movie.name}<span>{movie.duration}</span></div>
                            })}
                    </div>
                    : false
            }
        </>
    )
}
export default Playlist;