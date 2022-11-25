import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef, useEffect } from 'react';
import './index.css';
import SendButton from '../../assets/SendButton.svg';

const Chat = ({ socket, show, userId, setOnline }) => {
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

            setOnline(true);

            socket.on('blocked', () => {
                socket.disconnect();
            })

            socket.on('user join', (msg) => {
                let item = document.createElement('li');
                const now = new Date();
                const current = now.getHours() + ':' + now.getMinutes();
                item.classList.add('others-message');
                item.innerHTML = `<span></span><div class="content" >${msg}<span>${current}</span></div>`;
                ref.current?.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
            })

            socket.on('receive message', ({ msg, name, id }) => {
                let item = document.createElement('li');
                const now = new Date();
                const current = now.getHours() + ':' + now.getMinutes();
                if (userId === id) {
                    item.classList.add('my-message');
                } else {
                    item.classList.add('others-message');
                }
                item.innerHTML = `<span>${name}:</span><div class="content" >${msg}<span>${current}</span></div>`;
                ref.current?.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
            })

            socket.on('disconnect', () => {
                setOnline(false);
            })

        });

        handleSendMessage = () => {
            socket.emit('chat message', message);
            setMessage('');
        }
    }
    return (
        <div className="chat-bar">
            {
                show === 'Chat' ?
                    <>
                        <ul ref={ref}>

                        </ul>

                        <div>
                            <input className="chat-input" type='text' placeholder="Message" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                            <button className="send-message" onClick={handleSendMessage}><img src={SendButton} /></button>
                        </div>
                    </>
                    : false
            }
        </div>
    )
}
export default Chat;