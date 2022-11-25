import { GlobalStateContext } from "../../context/GlobalState";
import { useContext, useRef, useState } from 'react';
import ReactDom from "react-dom";
import PlayButton from '../assets/PlayButton.svg';
import 'react-edit-text/dist/index.css';
import './TheaterDisplay.css';
import { useNavigate } from "react-router-dom";


const TheaterDisplay = ({ theater, setShowModal }) => {

    const userInfo = useContext(GlobalStateContext)
    const modalRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const blur = document.getElementById('root') as any;
    document.body.classList.add('body-overflow');
    blur.classList.add('model-on');
    
    return ReactDom.createPortal(
        <div className="theater-display-container" style={{ backgroundImage: `url(${theater.showing.image})` }} ref={modalRef} onClick={(e) => e.target === modalRef.current && setShowModal(false)}>
            <button className="close-button-theater" onClick={() => { setShowModal(false); blur.classList.remove('model-on'); document.body.classList.remove('body-overflow'); }}>X</button>
            <div className="theater-modal" onClick={() => {
                blur.classList.remove('model-on');
                navigate('/theater', {
                    state: {
                        theaterId: theater._id,
                        url: theater.showing.url,
                        name: theater.showing.name,
                        image: theater.showing.image,
                        playlist: theater.playlist
                    }
                })
            }}>
                <div className="theater-details">
                    <span className="theater-display-title">{theater.name}</span>
                    <span>{theater.showing.description}</span>
                </div>
                <div className="theater-details-playlist">
                    {theater.playlist.map(movie => {
                        return <div className="playlist-movie"><img src={PlayButton} /><span>{movie.name}</span><span>{movie.duration}</span></div>
                    })}
                </div>
            </div>
        </div>,
        document.getElementById("theater-display") as HTMLElement
    )
}
export default TheaterDisplay;