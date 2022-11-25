import { useContext, useEffect, ReactElement, useRef, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import io from "socket.io-client";
import Theater from "../../components/ui/Theater";
import BuLogo from '../../components/assets/BuLogo.png';
import LogoutButton from '../../components/assets/LogoutButton.svg';
import './index.css';
import { useNavigate } from "react-router-dom";
let theaters = {};


const MainPage: () => ReactElement<any, any> = () => {


    const [stat, setStat] = useState([]);
    const userInfo = useContext(GlobalStateContext);
    const navigate = useNavigate();
    const [online, setOnline] = useState([]);
    const socket = async () => {
        const socket = io('http://localhost:80/main')

        socket.on('connect_error', (e: any) => {
            console.log(e)
        })

        socket.on('connect', async () => {
            socket.on('theaters', (msg) => {
                theaters = JSON.parse(msg);
                for (const [key, value] of Object.entries(theaters)) {
                    if (typeof (value as any).duration === 'number')
                        setOnline([...online, key] as never[])
                    if (stat.length <= 5) {
                        setStat([...stat, key] as never[])
                    }
                }
                setStat(Object.keys(theaters) as never[]);
            })

        });
    }

    useEffect(() => {
        socket();
        const fetch = async () => {
            await userInfo.auth();
            await userInfo.getAllTheaters();
        }
        fetch();
    }, [])



    return (
        <div className="main-page">
            <div className="header">
                <img src={BuLogo} />
                <div className="user-display">{
                    userInfo.user.loggedIn ?
                        <><div className="user-profile-header" onClick={() => navigate('profile')}><img src={`http://localhost/image/` + userInfo.user.image} /><span className="display-user-name">{userInfo.user.name}</span></div><img onClick={() => { userInfo.logout(); window.location.reload(); }} className="logout-button" src={LogoutButton} /></> :
                        <><button className="user-edit-btn" onClick={() => navigate('login')}>Sign In</button></>

                }</div>
            </div>
            <div className="theaters-page">
                <div className="top-5-theaters">
                    <h1>Online Theaters</h1>
                    {stat.length === 0 ?
                        <h3>Nothing to display</h3> :
                        userInfo.user.allTheaters?.map((theater: any) => {
                            if (typeof theaters[theater._id] !== 'undefined')
                                theater.details = theaters[theater._id]
                            if (stat.includes(theater._id as never))
                                return <Theater key={theater._id} theater={theater} online={true} />
                        })}
                </div>
                <div className="main-right">
                    <h1>All Theaters</h1>
                    <div className="offline-theaters">
                        {userInfo.user.allTheaters?.map((theater: any) => {
                            if (typeof theaters[theater._id] !== 'undefined')
                                theater.details = theaters[theater._id]
                            return <Theater key={theater._id} theater={theater} online={false} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MainPage;