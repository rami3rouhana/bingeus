import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../context/GlobalState';
import './index.css';
import playButton from '../../assets/playButton.png';

const Theater = ({ theater }) => {
    const userInfo = useContext(GlobalStateContext);
    const navigate = useNavigate();
    return (
        <div className='theater-display' style={{ backgroundImage: `url(${theater.showing.image})` }} onClick={() => {
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
            <div className='theater-banner'><img src={playButton} /><span>{theater.showing.name}</span><span>{theater.showing.duration}</span></div>
        </div>
    )
}


export default Theater;