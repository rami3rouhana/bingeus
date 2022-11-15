import { GlobalStateContext } from "../../../context/GlobalState";
import { useContext, useState, useRef, useEffect } from 'react';
import { EditText } from "react-edit-text";

const Poll = ({ chatSocket, show }) => {
    const userInfo = useContext(GlobalStateContext);
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState([{ name: 'option' }, { name: 'option' }]);
    const ref = useRef<HTMLUListElement>(null);
    const addOptionsHandler = () => {
        setOptions([...options, { name: '' }]);
    }
    if (chatSocket !== null)
        chatSocket.on('connect', async () => {
            chatSocket.on('add poll', (poll) => {
                let item = document.createElement('li');
                item.textContent = poll.title;
                ref.current?.appendChild(item);
                poll.options.map(option => {
                    let item = document.createElement('li');
                    item.textContent = option.name;
                    ref.current?.appendChild(item);
                })
            })
        })

    const savePoll = () => {
        const valid = options.map(option => option.name === '' ? false : true);
        if (title !== '' && !valid.includes(false)) {
            chatSocket.emit('create poll', { title, options });
            window.scrollTo(0, document.body.scrollHeight);
            setTitle('');
            setOptions([{ name: 'option' }, { name: 'option' }])
        }
        else
            Error('Please Enter a title or options');
    }

    return (
        <>
            {
                show === 'Poll' ?
                    <>
                        <EditText placeholder="Ask Question" value={title} onChange={(e) => { setTitle(e.currentTarget.value) }}></EditText>
                        <div>
                            {options?.map((option, index) => {
                                return <EditText key={Math.random()} name={index.toString()} placeholder={option.name} onSave={async (e) => {
                                    const update: any = options.map((option, index) => {
                                        if (index.toString() === e.name)
                                            return { name: e.value };
                                        return option;
                                    })
                                    setOptions(update);
                                }}
                                ></EditText>
                            })}
                        </div>
                        <button onClick={addOptionsHandler}>Add</button>
                        <button onClick={savePoll}>Save</button>
                        <ul ref={ref}>

                        </ul>
                    </>
                    : false
            }
        </>
    )
}
export default Poll;