import React, { useState, useMemo, useEffect } from "react";
import { Form, Radio, Button, message } from "antd";
import { TrackForm } from "./TrackForm";
import { AddArtistForm } from "./AddArtistForm";
import { AddAlbumForm } from "./AddAlbumForm";
import { useErrors } from "../../hooks/useErrors";
import { useAppState } from "../../hooks/useAppState";
import { addTrack, addArtist, addAlbum } from "../../api/calls";
import { MESSAGE_TIMEOUT } from "../../util/constants";
import "./ManageStore.css";

const FORM_TYPES = {
  track: "track",
  artist: "artist",
  album: "album",
  playlist: "",
};

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
  const { setLoading } = useAppState();
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
          genre: { ID: data.genreID },
          unitPrice: data.unitPrice.toString(),
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
        message.success("Entity successfully created", MESSAGE_TIMEOUT);
        form.resetFields();
      })
      .catch(handleError)
      .finally(() => setLoading(false));
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
          <Radio.Button value="track">Track</Radio.Button>
          <Radio.Button value="album">Album</Radio.Button>
          <Radio.Button value="artist">Artist</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {formElement}
      <Form.Item
        type="primary"
        wrapperCol={{
          span: 14,
          offset: 4,
        }}
      >
        <Button onClick={() => form.submit()}>Create</Button>
      </Form.Item>
    </Form>
  );
};

export { ManageStore };
