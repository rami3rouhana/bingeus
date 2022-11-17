import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef } from 'react';
import Chat from "../../sidebar/Chat";
import Users from "../../sidebar/Users";
import Poll from "../../sidebar/Poll";
import Playlist from "../../sidebar/Playlist";
import './index.css'
const SideBar = ({ chatSocket, movieSocket, playlist, setUrl }) => {
    const userInfo = useContext(GlobalStateContext);
    const buttons = [`Chat`, `Users`, `Poll`, `Playlist`, `Lock`]
    const [show, setShow] = useState<string>(`Chat`)
    const ref = useRef<HTMLButtonElement>(null);


    const buttonsHandler = (e: any) => {
        setShow(e.currentTarget.innerHTML);
    }

    return (
        <div className="side-bar">
            <div className="theater-btns">
                {
                    userInfo.user.loggedIn ?
                        buttons.map(button => {
                            return <button ref={ref} onClick={buttonsHandler}>{button}</button>
                        }) : false
                }
            </div>
            <Users socket={chatSocket} show={show} />
            <Chat socket={chatSocket} show={show} />
            <Poll chatSocket={chatSocket} show={show} />
            <Playlist playlist={playlist} setUrl={setUrl} movieSocket={movieSocket} show={show} />
        </div>
    )
}
export default SideBar;