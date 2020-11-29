import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useAppState } from '../../hooks/useAppState';
import { TrackCardBody } from './TrackCardBody';

const Track = ({ initialTrack, isAlreadyOrdered }) => {
  const trackElement = useRef();
  const { setInvoicedItems, invoicedItems } = useAppState();
  const [isJustInvoiced, setIsJustInvoiced] = useState(
    invoicedItems.find((curTrack) => curTrack.ID === initialTrack.ID)
  );

  const onChangedStatus = () => {
    const newIsJustInvoiced = !isJustInvoiced;
    if (newIsJustInvoiced) {
      setInvoicedItems([
        ...invoicedItems,
        {
          ID: initialTrack.ID,
          name: initialTrack.name,
          artist: initialTrack.album.artist.name,
          albumTitle: initialTrack.album.title,
          unitPrice: initialTrack.unitPrice,
        },
      ]);
    } else {
      setInvoicedItems(invoicedItems.filter(({ ID: curID }) => curID !== initialTrack.ID));
    }
    setIsJustInvoiced(newIsJustInvoiced);
  };

  return (
    <div className="card-element" ref={trackElement}>
      <Card
        actions={[
          <>
            {!isAlreadyOrdered && (
              <Button onClick={onChangedStatus} danger={isJustInvoiced}>
                {isJustInvoiced ? <MinusOutlined /> : <PlusOutlined />}
              </Button>
            )}
          </>,
        ]}
        title={initialTrack.name}
        bordered={false}
      >
        <TrackCardBody track={initialTrack} />
      </Card>
    </div>
  );
};

Track.propTypes = {
  initialTrack: PropTypes.object,
  isAlreadyOrdered: PropTypes.bool,
};

export { Track };
