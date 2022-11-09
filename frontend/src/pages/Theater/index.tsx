import { useContext, useEffect, ReactElement, useRef } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";


const TheaterPage: () => ReactElement<any, any> = () => {
    const userInfo = useContext(GlobalStateContext);
    const navigate = useNavigate();
    const ref = useRef<HTMLUListElement>(null);
    const socket = async () => {

        await userInfo.auth();
        if (!userInfo.user.loggedIn) {
            navigate('/login');
        }

        const socket = io('http://localhost:80/theater', {
            auth: {
                theater: '63593e5753ddddc1b35bc72d',
                token: userInfo.user.jwt
            }
        })

        socket.on('connect_error', (e: any) => {
            let item = document.createElement('li');
            item.textContent = e;
            ref.current?.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        })

        socket.on('connect', async () => {

            console.log(socket)
            socket.on('blocked', () => {
                socket.disconnect();
            })

            socket.on('receive message', (msg) => {
                let item = document.createElement('li');
                item.textContent = msg;
                ref.current?.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
            })

        });
    }
    useEffect(() => {
        socket();
    }, [])

    return (
        <>
            <ul ref={ref}>

            </ul>
        </>
    )
}
export default TheaterPage;