import { GlobalStateContext } from "../../context/GlobalState";
import { useContext, useRef, useState } from 'react';
import ReactDom from "react-dom";
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';


const TheaterAdd = ({ setShowModal }) => {

    const userInfo = useContext(GlobalStateContext)

    const modalRef = useRef<HTMLInputElement>(null);

    const handleAddTheater = async () => {

    }

    const test = `http://www.omdbapi.com/?apikey=8c589a6b&t=`

    return ReactDom.createPortal(
        <div className="container" ref={modalRef} onClick={(e) => e.target === modalRef.current && setShowModal(false)}>
            <div className="modal">
                <button onClick={() => setShowModal(false)}>X</button>
                <input type='file' multiple></input>
                <button onClick={handleAddTheater}>Finalize Theater</button>
            </div>
        </div>,
        document.getElementById("theater-add") as HTMLElement
    )
}
export default TheaterAdd;