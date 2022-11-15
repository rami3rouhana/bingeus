import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef } from 'react';

const Chat = ({ socket, show }) => {
    const [message, setMessage] = useState<string>('');
    const ref = useRef<HTMLUListElement>(null);
    let handleSendMessage: () => void = () => null;

    if (socket !== null) {
        socket.on('connect_error', (e: any) => {
            let item = document.createElement('li');
            item.textContent = e;
            ref.current?.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        })

        socket.on('connect', async () => {
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

        handleSendMessage = () => {
            socket.emit('chat message', message);
            setMessage('');
        }
    }
    return (
        <>
            {
                show === 'Chat' ?
                    <>
                        <ul ref={ref}>

                        </ul>

                        <input type='text' placeholder="Message" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                        <button onClick={handleSendMessage}>Send Message</button>
                    </>
                    : false
            }
        </>
    )
}
export default Chat;