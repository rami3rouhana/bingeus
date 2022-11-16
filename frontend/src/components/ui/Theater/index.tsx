import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../context/GlobalState';

const Theater = ({ theater }) => {
    const userInfo = useContext(GlobalStateContext);
    const navigate = useNavigate();
    return (
        <div onClick={() => {
            navigate('/theater', {
                state: {
                    theaterId: theater._id,
                    url: theater.showing.url,
                    name: theater.showing.name,
                    image: theater.showing.image,
                    playlist: theater.playlist
                }
            })
        }}>{theater._id}</div>
    )
}


export default Theater;