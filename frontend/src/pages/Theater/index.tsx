import { useContext, useEffect, ReactElement, useRef, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Movie from "../../components/screen/Movie";
import SideBar from "../../components/screen/SideBar";


const TheaterPage: () => ReactElement<any, any> = () => {
    const userInfo = useContext(GlobalStateContext);
    const navigate = useNavigate();
    let chatSocket: Socket | null = null;
    let pollSocket: Socket | null = null;
    let movieSocket: Socket | null = null;

    if (userInfo.user.jwt !== '')
        chatSocket = io('http://localhost:80/theater', {
            auth: {
                theater: '63593e5753ddddc1b35bc72d',
                token: userInfo.user.jwt
            }
        })

    if (userInfo.user.jwt !== '')
        pollSocket = io('http://localhost:80/poll', {
            auth: {
                theater: '63593e5753ddddc1b35bc72d',
                token: userInfo.user.jwt
            }
        })


    if (userInfo.user.jwt !== '')
        movieSocket = io('http://localhost:80/movie', {
            auth: {
                theater: '63593e5753ddddc1b35bc72d',
                token: userInfo.user.jwt
            }
        })


    const auth: any = async () => {
        await userInfo.auth();
        if (!userInfo.user.loggedIn) {
            navigate('/login');
        }
    };

    useEffect(() => {
        auth();
    }, [])

    return (
        <>
            <Movie movieSocket={movieSocket} />
            <SideBar chatSocket={chatSocket} pollSocket={pollSocket} />
        </>
    )
}
export default TheaterPage;