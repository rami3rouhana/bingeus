import { useContext, useEffect, ReactElement, useRef, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Theater from "../../components/ui/Theater";
let theaters = {};


const MainPage: () => ReactElement<any, any> = () => {

    const [stat, setStat] = useState([]);
    const userInfo = useContext(GlobalStateContext);
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
            await userInfo.getAllTheaters();
        }
        fetch();
    }, [])



    return (
        <>
            <div>
                {userInfo.user.allTheaters?.map((theater: any) => {
                    if (typeof theaters[theater._id] !== 'undefined')
                        theater.details = theaters[theater._id]
                    if (stat.includes(theater._id as never))
                        return <Theater key={theater._id} theater={theater} />
                })}
            </div>
            <div>
                {userInfo.user.allTheaters?.map((theater: any) => {
                    if (typeof theaters[theater._id] !== 'undefined')
                        theater.details = theaters[theater._id]
                    if (online.includes(theater._id as never))
                        return <Theater key={theater._id} theater={theater} />
                })}
            </div>
            <div>
                {userInfo.user.allTheaters?.map((theater: any) => {
                    if (typeof theaters[theater._id] !== 'undefined')
                        theater.details = theaters[theater._id]
                    if (!online.includes(theater._id as never))
                        return <Theater key={theater._id} theater={theater} />
                })}
            </div>
        </>
    )
}
export default MainPage;