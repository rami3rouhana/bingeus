import { GlobalStateContext } from "../../context/GlobalState";
import { useContext, useRef, useState } from 'react';
import ReactDom from "react-dom";
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';


const TheaterAdd = ({ setShowModal }) => {

    const userInfo = useContext(GlobalStateContext)
    const [images, setImages] = useState([])
    const modalRef = useRef<HTMLInputElement>(null);

    const onChangeHandler = async (e: any) => {
        const image = new FormData();
        const newImages = [...images, ...e.target.files];

        setImages(newImages as never[]);

        newImages.map(img => {
            image.append('file', e.target.files);
        })

    }

    const handleAddTheater = async () => {

    }

    const test = `http://www.omdbapi.com/?apikey=8c589a6b&t=`

    return ReactDom.createPortal(
        <div className="container" ref={modalRef} onClick={(e) => e.target === modalRef.current && setShowModal(false)}>
            <div className="modal">
                {images?.map((image: any) => {
                    <li key={image.lastModified}>{image.name.split('.')[0]}</li>
                    return <EditText showEditButton defaultValue={image.name.split('.')[0]} />
                })}
                <button onClick={() => setShowModal(false)}>X</button>
                <input onChange={onChangeHandler} type='file' multiple />
                <button onClick={handleAddTheater}>Finalize Theater</button>
            </div>
        </div>,
        document.getElementById("theater-add") as HTMLElement
    )
}
export default TheaterAdd;