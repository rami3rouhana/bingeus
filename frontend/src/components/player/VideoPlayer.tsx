import * as React from 'react';
import { useEffect } from 'react';
import { duration, styled } from '@mui/material';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import PlayerControls from './PlayerControls';
import PlayerOverlay from './PlayerOverlay';
import { INITIAL_STATE, reducer } from './Player.reducer';



const StyledPlayer = styled('div') <ReactPlayerProps>`
  position: relative;
  aspect-ratio: 16/9;

  // defined from script, if props light is true then is visible
  .react-player__preview:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
  }

  &:hover {
    .video-player__controls {
      opacity: 1;
    }
  }

  .video-player__controls {
    opacity: ${({ state }) => (state.light ? '0' : state.playing ? '0' : '1')};
  }
`;

export const VideoPlayer: React.FC<any> = (props) => {
  const { url, light, movieSocket } = props;
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const playerRef = React.useRef<ReactPlayer>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const STATE = state as any;
  console.log(STATE)
  if (movieSocket)
    movieSocket.on('connect', () => {
      movieSocket.on('isAdmin', (admin, playing) => {
        setIsAdmin(admin);
        setIsPlaying(playing);
      })

      movieSocket.on('handle preview', (duration) => handlePreview(duration))
      movieSocket.on('handle pause', (duration, playing) => { handlePause(duration, playing) })
      movieSocket.on('handle play', (duration, playing) => { handlePlay(duration, playing) })
      movieSocket.on('handle ended', handleEnded)
      movieSocket.on('handle progress', handleProgress)
      movieSocket.on('handle duration', handleDuration)
    })

  useEffect(() => {
    if (movieSocket)
      if (!isAdmin) {
        if (!isPlaying) {
        };
      }
  }, [isAdmin, isPlaying])

  const handlePreview = (duration?: number) => {
    handlePlay();
    if (isAdmin) {
      movieSocket.emit('handle preview');
    } else {
      if (typeof duration === 'number') {
        playerRef.current?.seekTo(duration);
        dispatch({ type: 'SEEK', payload: duration });
      }
    }
    dispatch({ type: 'LIGHT', payload: false });
  }

  const handlePause = (duration?: number, isPlaying?: boolean) => {
    if (isAdmin) {
      movieSocket.emit('handle pause');
    } else {
      if (typeof duration === 'number') {
        playerRef.current?.seekTo(duration);
        dispatch({ type: 'SEEK', payload: duration });
      }
    }
    if (!isPlaying)
      dispatch({ type: 'PAUSE' });
  };

  const handlePlay = (duration?: number, isPlaying?: boolean) => {
    if (isAdmin) {
      movieSocket.emit('handle play');
    } else {
      if (typeof duration === 'number') {
        playerRef.current?.seekTo(duration);
        dispatch({ type: 'SEEK', payload: duration });
      }
    }
    if (isPlaying || isAdmin)
      dispatch({ type: 'PLAY' });
  };

  const handleEnded = () => {
    if (isAdmin)
      movieSocket.emit('handle ended');
    dispatch({ type: 'LIGHT', payload: true });
    playerRef.current?.showPreview();
  };


  const handleProgress = (progress: { playedSeconds: number }) => {

    if (isAdmin) {
      movieSocket.emit('handle progress', progress);
    } else {
      movieSocket.emit('handle progress', progress);
      if (Math.abs(progress.playedSeconds - STATE.progress.playedSeconds) > 5) {
        playerRef.current?.seekTo(progress.playedSeconds);
        dispatch({ type: 'SEEK', payload: progress.playedSeconds });

      }
    }
    dispatch({ type: 'SEEK', payload: progress.playedSeconds });
  };

  const handleDuration = (duration: number) => {
    if (isAdmin)
      movieSocket.emit('handle duration', duration);
    dispatch({ type: 'DURATION', payload: duration });
  };

  return (
    <StyledPlayer state={state} ref={wrapperRef}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        light={light}
        playIcon={
          <PlayArrowRounded
            sx={{
              color: 'blue',
              fontSize: '6rem',
            }}
          />
        }
        controls={state.controls}
        loop={state.loop}
        muted={state.muted}
        playing={state.playing}
        playbackRate={state.playbackRate}
        volume={state.volume}
        onPlay={handlePlay}
        onEnded={handleEnded}
        onPause={handlePause}
        onDuration={handleDuration}
        onProgress={handleProgress}
        onClickPreview={handlePreview}
      />
      <PlayerOverlay state={state} />
      {!state.controls && !state.light && (
        <PlayerControls state={state} dispatch={dispatch} playerRef={playerRef} wrapperRef={wrapperRef} isAdmin={isAdmin} />
      )}
    </StyledPlayer>
  );
}


export default VideoPlayer;
