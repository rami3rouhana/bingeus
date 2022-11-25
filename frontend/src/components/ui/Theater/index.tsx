import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../context/GlobalState';
import './index.css';
import playButton from '../../assets/playButton.png';
import TheaterDisplay from '../../models/TheaterDisplay';

const Theater = ({ theater, online }) => {
    const userInfo = useContext(GlobalStateContext);
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            {online ?
                <div className='theater-display-online' onClick={() => { setShowModal(true); window.scrollTo(0, 0); }} style={{ backgroundImage: `url(${theater.showing.image})` }} >
                    <div className='theater-banner-online'><img src={playButton} /><span>{theater.showing.name}</span><span>{theater.showing.duration}</span></div> </div> :
                <div className='theater-display' onClick={() => { setShowModal(true); window.scrollTo(0, 0); }} style={{ backgroundImage: `url(${theater.showing.image})` }} >
                    <div className='theater-banner'><img src={playButton} /><span>{theater.showing.name}</span><span>{theater.showing.duration}</span></div></div>
            }
            {showModal ? <TheaterDisplay theater={theater} setShowModal={setShowModal} /> : null}
        </>
    )
}


export default Theater;