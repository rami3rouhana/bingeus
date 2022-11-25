import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { EditText } from "react-edit-text";
import ReactDom from "react-dom";
import { GlobalStateContext } from "../../context/GlobalState";
import './TheaterAdd.css';
import { LinearProgress } from "@mui/material";

const chunkSize = 100 * 1024;

const TheaterAdd = ({ setShowModal }) => {

    const userInfo = useContext(GlobalStateContext);
    const modalRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>('')
    const [dropzoneActive, setDropzoneActive] = useState<boolean>(false);
    const [files, setFiles] = useState<any>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<null | number>(null);
    const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<null | number>(null);
    const [currentChunkIndex, setCurrentChunkIndex] = useState<null | number>(null);
    const [upload, setUpload] = useState<boolean>(false);
    const [verified, setVerified] = useState<any>([]);
    const test = `http://www.omdbapi.com`;

    const handleDrop = (e) => {
        e.preventDefault();
        setFiles([...files, ...e.dataTransfer.files] as any);
    }

    const readAndUploadCurrentChunk = () => {
        const reader = new FileReader();
        const file = files[currentFileIndex as number];
        if (!file) {
            return;
        }
        const from = currentChunkIndex as number * chunkSize;
        const to = from + chunkSize;
        const blob = file.slice(from, to);
        reader.onload = e => uploadChunk(e);
        reader.readAsDataURL(blob);
    }

    const uploadChunk = (readerEvent) => {
        const file = files[currentFileIndex as number];
        const data = readerEvent.target.result;
        const params = new URLSearchParams();
        params.set('name', file.name);
        params.set('size', file.size);
        params.set('currentChunkIndex', currentChunkIndex?.toString() as string);
        params.set('totalChunks', Math.ceil(file.size / chunkSize).toString());
        const headers = { 'Content-Type': 'application/octet-stream' };
        const url = 'theater/video?' + params.toString();
        axios.post(url, data, { headers })
            .then(async response => {
                const file = files[currentFileIndex as number];
                const filesize = files[currentFileIndex as number].size;
                const chunks = Math.ceil(filesize / chunkSize) - 1;
                const isLastChunk = currentChunkIndex === chunks;
                if (isLastChunk) {
                    file.finalFilename = response.data.finalFilename;
                    setLastUploadedFileIndex(currentFileIndex);
                    setCurrentChunkIndex(null);
                    if (files.length === currentFileIndex as number + 1) {
                        const uploadedFiles = {};
                        files.map((file: any, index: number) => {
                            uploadedFiles[index] = {
                                name: file.realName,
                                url: file.finalFilename,
                                image: file.image,
                                duration: file.timeLength,
                                description: file.plot,
                            }
                        })
                        const data = {
                            name,
                            uploadedFiles
                        }
                        await userInfo.addTheater(data);
                        setShowModal(false);
                        blur.classList.remove('model-on');
                        document.body.classList.remove('body-overflow');

                    }
                } else {
                    setCurrentChunkIndex(currentChunkIndex as number + 1);
                }
            });
    }

    useEffect(() => {
        if (lastUploadedFileIndex === null) {
            return;
        }
        const isLastFile = lastUploadedFileIndex === files.length - 1;
        const nextFileIndex = isLastFile ? null : currentFileIndex as number + 1;
        setCurrentFileIndex(nextFileIndex);
    }, [lastUploadedFileIndex]);

    useEffect(() => {
        if (files.length > 0) {
            if (currentFileIndex === null) {
                setCurrentFileIndex(
                    lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
                );
                setUpload(false);
            }
        }
    }, [files.length]);

    useEffect(() => {
        if (currentFileIndex !== null) {
            setCurrentChunkIndex(0);
        }
    }, [currentFileIndex]);

    useEffect(() => {
        if (currentChunkIndex !== null) {
            if (upload && name !== '')
                readAndUploadCurrentChunk();
        }
    }, [currentChunkIndex, upload]);


    const blur = document.getElementsByClassName('profile-page')[0];
    document.body.classList.add('body-overflow');
    blur.classList.add('model-on');



    return ReactDom.createPortal(
        <div className="theater-container" ref={modalRef} onClick={(e) => e.target === modalRef.current && setShowModal(false)}>
            <div className="modal">
                <button className="close-button-upload" onClick={() => { setShowModal(false); blur.classList.remove('model-on'); document.body.classList.remove('body-overflow'); }}>X</button>
                <EditText className="upload-movie-edit-title" inputClassName="upload-movie-edit-title" placeholder="Theater Name" onSave={(e) => {
                    setName(e.value);
                }} />
                <div className="files">
                    {files.map((file: any, fileIndex: number) => {
                        let progress = 0;
                        if (file.finalFilename) {
                            progress = 100;
                        } else {
                            const uploading = fileIndex === currentFileIndex;
                            const chunks = Math.ceil(file.size / chunkSize);
                            if (uploading) {
                                progress = Math.round(currentChunkIndex as number / chunks * 100);
                            } else {
                                progress = 0;
                            }
                        }
                        return (
                            <a className="file" target="_blank" key={file.lastModified}>
                                <EditText className="upload-movie-edit" inputClassName="upload-movie-edit" onSave={async (e) => {
                                    const movie = await axios.get(`?apikey=${process.env.REACT_APP_API_OMDB_API_KEY}&t=${e.value}`, { baseURL: "http://www.omdbapi.com/" });
                                    if (movie.data.Error)
                                        return Error(movie.data.Error);
                                    setVerified([...verified, fileIndex]);
                                    file.plot = movie.data.Plot;
                                    file.image = movie.data.Poster;
                                    file.timeLength = movie.data.Runtime;
                                    file.realName = movie.data.Title;
                                }} defaultValue={file.name.split('.')[0]} />
                                <LinearProgress variant="determinate" value={progress} />
                                <div className="name">{file.name}</div>
                            </a>
                        );
                    })}
                </div>
                <div
                    onDragOver={e => { setDropzoneActive(true); e.preventDefault(); }}
                    onDragLeave={e => { setDropzoneActive(false); e.preventDefault(); }}
                    onDrop={e => handleDrop(e)}
                    className={"dropzone" + (dropzoneActive ? " active" : "")}>
                    Drag and drop your movies
                </div>
                <button className="user-video-edit-btn" onClick={() => {
                    if (verified.length === files.length)
                        setUpload(true);
                    else
                        Error("Verify all the movies")
                }}>Upload</button>
            </div>
        </div>,
        document.getElementById("theater-add") as HTMLElement
    )
}

export default TheaterAdd;