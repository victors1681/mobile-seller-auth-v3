import * as React from 'react';
import { CircularProgress } from '@material-ui/core';

export const Loader = ({ isLoading }: { isLoading: boolean }) =>
  isLoading ? (
    <div
      style={{
        position: 'absolute',
        zIndex: 110,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.8)'
      }}
    >
      <CircularProgress size={24} />
    </div>
  ) : null;

export default Loader;
