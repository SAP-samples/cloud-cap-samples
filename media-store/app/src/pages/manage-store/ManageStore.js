import React, { useState, useMemo, useEffect } from "react";
import { Form, Radio, Button, message } from "antd";
import { TrackForm } from "./TrackForm";
import { AddArtistForm } from "./AddArtistForm";
import { AddAlbumForm } from "./AddAlbumForm";
import { useErrors } from "../../useErrors";
import { useGlobals } from "../../GlobalContext";
import { addTrack, addArtist, addAlbum } from "../../api-service";
import "./ManageStore.css";

const FORM_TYPES = {
  track: "track",
  artist: "artist",
  album: "album",
  playlist: "",
};
const DEFAULT_MEDIA_TYPE_ID = 1;
const MESSAGE_TIMEOUT = 2;

const chooseForm = (type) => {
  return (
    (type === "track" && <TrackForm />) ||
    (type === "artist" && <AddArtistForm />) ||
    (type === "album" && <AddAlbumForm />)
  );
};

const ManageStore = () => {
  const [form] = Form.useForm();
  const { handleError } = useErrors();
  const { setLoading } = useGlobals();
  const [formType, setFormType] = useState("track");

  useEffect(() => {
    form.resetFields();
  }, [formType]);

  const formElement = useMemo(() => {
    return chooseForm(formType);
  }, [formType]);

  const onChangeForm = (event) => {
    setFormType(event.target.value);
  };

  const sendCreateRequest = ({ type, ...data }) => {
    setLoading(true);

    let promise;
    switch (type) {
      case FORM_TYPES.track:
        promise = addTrack({
          name: data.name,
          composer: data.composer,
          album: { ID: data.albumID },
          mediaType: { ID: DEFAULT_MEDIA_TYPE_ID },
          genre: { ID: data.genreID },
        });
        break;
      case FORM_TYPES.artist:
        promise = addArtist(data);
        break;
      case FORM_TYPES.album:
        promise = addAlbum({ title: data.name, artist: { ID: data.artistID } });
        break;
      default:
    }

    promise
      .then(() => {
        setLoading(false);
        message.success("Entity successfully created", MESSAGE_TIMEOUT);
        form.resetFields();
      })
      .catch(handleError);
  };

  return (
    <Form
      style={{ width: 700 }}
      form={form}
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      initialValues={{
        type: formType,
      }}
      type={formType}
      onFinish={sendCreateRequest}
      onFinishFailed={() => console.log("Not valid params provided")}
    >
      <Form.Item label="Entity" name="type">
        <Radio.Group onChange={onChangeForm}>
          <Radio.Button value="track" style={{ borderRadius: "6px 0 0 6px" }}>
            Track
          </Radio.Button>
          <Radio.Button value="album">Album</Radio.Button>
          <Radio.Button value="artist" style={{ borderRadius: "0 6px 6px 0" }}>
            Artist
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      {formElement}
      <Form.Item
        type="primary"
        wrapperCol={{
          span: 14,
          offset: 4,
        }}
        style={{ borderRadius: 6 }}
      >
        <Button onClick={() => form.submit()}>Create</Button>
      </Form.Item>
    </Form>
  );
};

export { ManageStore };
