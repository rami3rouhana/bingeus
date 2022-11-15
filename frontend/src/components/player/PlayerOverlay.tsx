import * as React from 'react';
import { Box, Chip, Fade, styled, Typography } from '@mui/material';
import { ReactPlayerProps } from 'react-player';

const StyledPlayerOverlay = styled('div') <ReactPlayerProps>`
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: end;
  left: 0;
  bottom: ${({ state }) => (state.light ? '0' : '94px')};
  background-color: ${({ state }) => (state.light || state.playing ? 'transparent' : 'rgba(0, 0, 0, 0.4)')};
  opacity: ${({ state }) => (state.playing ? '0' : '1')};
  transition: opacity 0.2s ease-in-out;
  width: 100%;
  bottom: 0;
  height: 25%;
  display: flex;
  justify-content: flex-start;

  .video-player__overlay-inner {
    padding-left: ${({ state }) => (state.light ? '50px' : '25px')};
    padding-bottom: ${({ state }) => (state.light ? '50px' : '38px')};
    width: ${({ state }) => (state.light ? 'auto' : '100%')};
  }
`;

const PlayerOverlay: React.FC<ReactPlayerProps> = (props) => {
  const { state } = props;

  return (
    <StyledPlayerOverlay state={state}>
      <Box className={'video-player__overlay-inner'}>
        <Fade in>
          <Typography variant="h4" color={'white'} mt={2}>
            Lost in Japan
          </Typography>
        </Fade>
      </Box>
    </StyledPlayerOverlay>
  );

};

export default PlayerOverlay;
