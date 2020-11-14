import React from "react";
import { Button, Modal, Form, message } from "antd";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { useErrors } from "../../useErrors";
import { TrackForm } from "../manage-store/TrackForm";
import { updateTrack, getTrack } from "../../api-service";

const MESSAGE_TIMEOUT = 2;

const EditAction = ({ ID, name, composer, genre, album, afterTrackUpdate }) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [form] = Form.useForm();
  const { handleError } = useErrors();

  const onShowModal = () => {
    setVisible(true);
  };

  const onFinish = (value) => {
    setConfirmLoading(true);
    updateTrack({
      ID,
      name: value.name,
      composer: value.composer,
      album: { ID: value.albumID },
      genre: { ID: value.genreID },
    })
      .then(() => {
        message.success("Track successfully updated!", MESSAGE_TIMEOUT);
        setConfirmLoading(false);
        setVisible(false);
        afterCloseModal();
      })
      .catch(handleError);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const afterCloseModal = () => {
    setUpdateLoading(true);
    getTrack(ID)
      .then((response) => {
        afterTrackUpdate(response.data);
        setUpdateLoading(false);
      })
      .catch(handleError);
  };

  return (
    <>
      {updateLoading ? (
        <LoadingOutlined />
      ) : (
        <EditOutlined onClick={onShowModal} />
      )}
      <Modal
        title="Edit track"
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={onFinish}
          onFinishFailed={() => console.log("Not valid params provided")}
          initialValues={{
            name: name,
            composer: composer,
            genreID: genre.ID,
            albumID: album.ID,
          }}
        >
          <TrackForm initialAlbumTitle={album.title} />
        </Form>
      </Modal>
    </>
  );
};

export { EditAction };
