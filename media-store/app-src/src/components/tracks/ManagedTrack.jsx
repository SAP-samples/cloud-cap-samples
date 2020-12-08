import React, { useState, useRef } from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import { EditAction } from './EditAction';
import { DeleteAction } from './DeleteAction';
import { TrackCardBody } from './TrackCardBody';
import './ManagedTrack.css';

const ManagedTrack = ({ initialTrack, onDeleteTrack }) => {
  const trackElement = useRef();
  const [track, setTrack] = useState(initialTrack);

  return (
    <div className="card-element" ref={trackElement}>
      <Card
        actions={[
          <DeleteAction
            ID={track.ID}
            onDeleteTrack={() => {
              trackElement.current.style.opacity = 0;
              setTimeout(() => onDeleteTrack(track.ID), 500);
            }}
          />,
          <EditAction
            ID={track.ID}
            name={track.name}
            composer={track.composer}
            album={track.album}
            genre={track.genre}
            unitPrice={track.unitPrice}
            afterTrackUpdate={(value) => setTrack(value)}
          />,
        ]}
        title={track.name}
        bordered={false}
      >
        <TrackCardBody track={track} />
      </Card>
    </div>
  );
};

ManagedTrack.propTypes = {
  initialTrack: PropTypes.object.isRequired,
  onDeleteTrack: PropTypes.func.isRequired,
};

export { ManagedTrack };
