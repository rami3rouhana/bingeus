import { Grid } from "@mui/material";
import VideoPlayer from "../../player/VideoPlayer";

const Movie = ({ movieSocket }) => {
    return (

        <VideoPlayer
            url={
                'http://localhost/theater/video/video1.mp4'
            }
            light={
                'https://m.media-amazon.com/images/M/MV5BNDVkYjU0MzctMWRmZi00NTkxLTgwZWEtOWVhYjZlYjllYmU4XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg'
            }
            movieSocket={movieSocket}
        />
    );
};
export default Movie;