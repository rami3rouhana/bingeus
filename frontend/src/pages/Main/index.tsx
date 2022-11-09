import { useContext, useEffect, ReactElement, useRef, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";


const MainPage: () => ReactElement<any, any> = () => {

    const [stat, setStat] = useState([]);
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
                const statistics = Object.keys(JSON.parse(msg)) as never[];
                setStat(statistics);
                item.textContent = msg;
                ref.current?.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
            })

        });
    }

    useEffect(() => {
        socket();
        const fetch = async () => {
            await userInfo.getAllTheaters();
        }
        fetch();
    }, [])



    return (
        <>
            <ul ref={ref}>
                {userInfo.user.allTheaters?.map((theater: any) => {
                    if (stat.slice(0, 5).includes(theater._id as never))
                        return <li key={theater._id }>{theater.name}</li>
                })}
            </ul>
        </>
    )
}
export default MainPage;