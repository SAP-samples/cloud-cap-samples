import React from 'react';
import PropTypes from 'prop-types';

const TrackCardBody = ({ track }) => {
  return (
    <>
      <div>
        Artist:
        <span style={{ fontWeight: 600 }}>{track.album.artist.name}</span>
      </div>
      <div>
        Album:
        <span style={{ fontWeight: 600 }}>{track.album.title}</span>
      </div>
      <div>
        Genre:
        <span style={{ fontWeight: 600 }}>{track.genre.name}</span>
      </div>
      <div>
        {track.composer && (
          <span>
            Compositor:
            <span style={{ fontWeight: 600 }}>{track.composer}</span>
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          Price:
          <span style={{ fontWeight: 600 }}>{track.unitPrice}</span>
        </span>
      </div>
    </>
  );
};

TrackCardBody.propTypes = {
  track: PropTypes.object.isRequired,
};

export { TrackCardBody };
