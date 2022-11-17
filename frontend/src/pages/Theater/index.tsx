import { useContext, useEffect, ReactElement, useRef, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import io, { Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import Movie from "../../components/screen/Movie";
import SideBar from "../../components/screen/SideBar";
import './index.css';

const TheaterPage: () => ReactElement<any, any> = () => {
    const userInfo = useContext(GlobalStateContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [url, setUrl] = useState(location.state.url)
    const [movieSocket, setMovieSocket] = useState<Socket | null>(null);
    const [chatSocket, setChatSocket] = useState<Socket | null>(null);
    const [pollSocket, setPollSocket] = useState<Socket | null>(null);
    // let chatSocket: Socket | null = null;
    // let pollSocket: Socket | null = null;
    // let movieSocket: Socket | null = null;

    const auth: any = async () => {
        await userInfo.auth();
        if (!userInfo.user.loggedIn) {
            navigate('/login');
        }
    };

    useEffect(() => {
        (async () => {
            await auth();
            if (location.state.theaterId === null)
                navigate('/');
            if (userInfo.user.jwt !== '')
                setChatSocket(io('http://localhost:80/theater', {
                    auth: {
                        theater: location.state.theaterId,
                        token: userInfo.user.jwt
                    }
                })
                )
            if (userInfo.user.jwt !== '')
                setPollSocket(io('http://localhost:80/poll', {
                    auth: {
                        theater: location.state.theaterId,
                        token: userInfo.user.jwt
                    }
                })
                )

            if (userInfo.user.jwt !== '') {
                setMovieSocket(io('http://localhost:80/movie', {
                    auth: {
                        theater: location.state.theaterId,
                        token: userInfo.user.jwt
                    }
                }))
            }
        })();
    }, []);


    return (
        <div className="theater-main">
            <Movie movieSocket={movieSocket} image={location.state.image} url={url} name={location.state.name} setUrl={setUrl} />
            <SideBar chatSocket={chatSocket} movieSocket={movieSocket} playlist={location.state.playlist} setUrl={setUrl} />
        </div>
    )
}
export default TheaterPage;