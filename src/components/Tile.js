import React from 'react';
import { ReactComponent as Bomb } from './bomb.svg';
import { ReactComponent as Flag } from './flag.svg';

const Tile = ({ value, state, reveal, flag }) => {
  return (
    <div 
      className={state === 'R' ? 'Tile--revealed' : 'Tile'}
      onClick={reveal}
      onContextMenu={e => {
        e.preventDefault();
        flag(); 
      }}
    >
      {state === 'F' && <Flag/>}
      {state === 'R' && value === 'M' && <Bomb/>}
      {state === 'R' && value !== 'M' && value !== 0 ? value : ' '}
    </div>
  );
};

export default Tile;
