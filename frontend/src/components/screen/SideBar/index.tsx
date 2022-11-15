import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef } from 'react';
import Chat from "../../sidebar/Chat";
import Users from "../../sidebar/Users";
import Poll from "../../sidebar/Poll";
import Playlist from "../../sidebar/Playlist";

const SideBar = ({ chatSocket, pollSocket }) => {
    const userInfo = useContext(GlobalStateContext);
    const buttons = [`Chat`, `Users`, `Poll`, `Playlist`, `Lock`]
    const [show, setShow] = useState<string>(`Chat`)
    const ref = useRef<HTMLButtonElement>(null);


    const buttonsHandler = (e: any) => {
        setShow(e.currentTarget.innerHTML);
    }

    return (
        <div>
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
            <Playlist socket={chatSocket} show={show} />
        </div>
    )
}
export default SideBar;