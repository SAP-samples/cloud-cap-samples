import React, { useState, useRef } from "react";
import { Card, Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useAppState } from "../../hooks/useAppState";
import { withRestrictedSection } from "../../hocs/withRestrictions";
import { EditAction } from "./EditAction";
import { DeleteAction } from "./DeleteAction";
import "./Track.css";

const RestrictedButton = withRestrictedSection(Button, ({ user }) => {
  return !!user && user.roles.includes("customer");
});

const RestrictedEditAction = withRestrictedSection(
  EditAction,
  ({ user }) => !!user && user.roles.includes("employee")
);
const RestrictedDeleteAction = withRestrictedSection(
  DeleteAction,
  ({ user }) => !!user && user.roles.includes("employee")
);

const Track = ({
  initialTrack,
  isButtonVisible,
  isInvoiced: isInvoicedProp,
  onDeleteTrack,
}) => {
  const trackElement = useRef();
  const { setInvoicedItems, invoicedItems } = useAppState();
  const [isInvoiced, setIsInvoiced] = useState(isInvoicedProp);
  const [track, setTrack] = useState(initialTrack);

  const onChangedStatus = () => {
    const newInvoiced = !isInvoiced;
    if (newInvoiced) {
      setInvoicedItems([
        ...invoicedItems,
        {
          ID: track.ID,
          name: track.name,
          artist: track.album.artist.name,
          albumTitle: track.album.title,
          unitPrice: track.unitPrice,
        },
      ]);
    } else {
      setInvoicedItems(
        invoicedItems.filter(({ ID: curID }) => curID !== track.ID)
      );
    }
    setIsInvoiced(newInvoiced);
  };

  return (
    <div className="card-element" ref={trackElement}>
      <Card
        actions={[
          <RestrictedDeleteAction
            ID={track.ID}
            onDeleteTrack={() => {
              trackElement.current.style.opacity = 0;
              setTimeout(() => onDeleteTrack(track.ID), 500);
            }}
          />,
          <RestrictedEditAction
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
        <div>
          Artist:{" "}
          <span style={{ fontWeight: 600 }}>{track.album.artist.name}</span>
        </div>
        <div>
          Album: <span style={{ fontWeight: 600 }}>{track.album.title}</span>
        </div>
        <div>
          Genre: <span style={{ fontWeight: 600 }}>{track.genre.name}</span>
        </div>
        <div>
          {track.composer && (
            <span>
              Compositor:{" "}
              <span style={{ fontWeight: 600 }}>{track.composer}</span>
            </span>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            Price: <span style={{ fontWeight: 600 }}>{track.unitPrice}</span>
          </span>
          {isButtonVisible && (
            <RestrictedButton
              type="primary"
              size="small"
              shape="circle"
              onClick={onChangedStatus}
              danger={isInvoiced}
            >
              {isInvoiced ? <MinusOutlined /> : <PlusOutlined />}
            </RestrictedButton>
          )}
        </div>
      </Card>
    </div>
  );
};

export { Track };
