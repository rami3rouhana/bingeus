import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef, useEffect } from 'react';
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
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [online, setOnline] = useState<boolean>(false);

    useEffect(() => {
        if (!online) {
            sidebarRef.current?.classList.add('block');
        } else {
            sidebarRef.current?.classList.remove('block');
        }
    }, [online])

    const buttonsHandler = (button: any) => {
        if (button === 'Lock') {
            if (sidebarRef.current?.classList[1] === 'unhide')
                sidebarRef.current?.classList.remove('unhide');
            else
                sidebarRef.current?.classList.add('unhide');
        }
        else
            setShow(button);
    }

    return (
        <div className="side-bar hidden" ref={sidebarRef} onMouseEnter={(e) => { e.currentTarget.classList.remove('hidden') }} onMouseLeave={(e) => { e.currentTarget.classList.add('hidden') }}>
            <div className="theater-btns">
                <button className="theater-buttons" ref={ref} onClick={() => buttonsHandler('Users')}><img src={UsersButton} /></button>
                <button className="theater-buttons" ref={ref} onClick={() => buttonsHandler('Chat')}><img src={ChatButton} /></button>
                <button className="theater-buttons" ref={ref} onClick={() => buttonsHandler('Lock')}><img src={LockButton} /></button>
                <button className="theater-buttons" ref={ref} onClick={() => buttonsHandler('Playlist')}><img src={PlayButton} /></button>
            </div>
            <Users socket={chatSocket} show={show} />
            {/* <Poll chatSocket={chatSocket} show={show} /> */}
            <Playlist playlist={playlist} setUrl={setUrl} movieSocket={movieSocket} show={show} />
            <Chat socket={chatSocket} show={show} userId={userInfo.user.id} setOnline={setOnline} />
        </div>
    )
}
export default SideBar;