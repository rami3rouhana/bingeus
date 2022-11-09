import { useContext, useEffect, ReactElement, useRef } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";


const MainPage: () => ReactElement<any, any> = () => {
    const userInfo = useContext(GlobalStateContext);

    const ref = useRef<HTMLUListElement>(null);
    const socket = async () => {
        const socket = io('http://localhost:80/main')

        socket.on('connect_error', (e: any) => {
            let item = document.createElement('li');
            item.textContent = e;
            ref.current?.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        })

        socket.on('connect', async () => {

            

            socket.on('theaters', (msg) => {
                let item = document.createElement('li');
                console.log(msg)
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
export default MainPage;