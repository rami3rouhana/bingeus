import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef } from 'react';
import Chat from "../../sidebar/Chat";
import Users from "../../sidebar/Users";
import Poll from "../../sidebar/Poll";
import Playlist from "../../sidebar/Playlist";
import './index.css'
import PlayButton from '../../assets/PlayButton.svg';
import ChatButton from '../../assets/ChatButton.svg';
import LockButton from '../../assets/LockButton.svg';
import UsersButton from '../../assets/UsersButton.svg';

const SideBar = ({ chatSocket, movieSocket, playlist, setUrl }) => {
    const userInfo = useContext(GlobalStateContext);
    const [show, setShow] = useState<string>(`Chat`)
    const ref = useRef<HTMLButtonElement>(null);


    const buttonsHandler = (button: any) => {
        setShow(button);
    }

    return (
        <div className="side-bar">
            <div className="theater-btns">
                <button className="theater-buttons" ref={ref} onClick={()=>buttonsHandler('Users')}><img src={UsersButton} /></button>
                <button className="theater-buttons" ref={ref} onClick={()=>buttonsHandler('Chat')}><img src={ChatButton} /></button>
                <button className="theater-buttons" ref={ref} onClick={()=>buttonsHandler('Lock')}><img src={LockButton} /></button>
                <button className="theater-buttons" ref={ref} onClick={()=>buttonsHandler('Playlist')}><img src={PlayButton} /></button>
            </div>
            <Users socket={chatSocket} show={show} />
            {/* <Poll chatSocket={chatSocket} show={show} /> */}
            <Playlist playlist={playlist} setUrl={setUrl} movieSocket={movieSocket} show={show} />
            <Chat socket={chatSocket} show={show} />
        </div>
    )
}
export default SideBar;