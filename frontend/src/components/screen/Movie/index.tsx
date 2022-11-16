import { Grid } from "@mui/material";
import VideoPlayer from "../../player/VideoPlayer";

const Movie = ({ movieSocket, image, url, name,setUrl}) => {
    return (
        <VideoPlayer
            url={`http://localhost/theater/video/${url}`}
            light={image}
            movieSocket={movieSocket}
            name={name}
            setUrl={setUrl}
        />
    );
};
export default Movie;