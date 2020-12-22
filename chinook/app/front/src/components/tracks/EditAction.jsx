import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, message } from 'antd';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useErrors } from '../../hooks/useErrors';
import { TrackForm } from '../manage-store/TrackForm';
import { updateTrack, getTrack } from '../../api/calls';
import { MESSAGE_TIMEOUT } from '../../util/constants';

const EditAction = ({ ID, name, composer, genre, unitPrice, album, afterTrackUpdate }) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [form] = Form.useForm();
  const { handleError } = useErrors();

  const onShowModal = () => {
    setVisible(true);
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

  const onFinish = (value) => {
    setConfirmLoading(true);
    updateTrack({
      ID,
      name: value.name,
      composer: value.composer,
      album: { ID: value.albumID },
      genre: { ID: value.genreID },
      unitPrice: value.unitPrice.toString(),
    })
      .then(() => {
        message.success('Track successfully updated!', MESSAGE_TIMEOUT);
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
    setVisible(false);
  };

  return (
    <>
      {updateLoading ? <LoadingOutlined /> : <EditOutlined onClick={onShowModal} />}
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
          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
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
          onFinishFailed={() => console.log('Not valid params provided')}
          initialValues={{
            name,
            composer,
            genreID: genre.ID,
            albumID: album.ID,
            unitPrice,
          }}
        >
          <TrackForm initialAlbumTitle={album.title} />
        </Form>
      </Modal>
    </>
  );
};

EditAction.propTypes = {
  ID: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  composer: PropTypes.string,
  genre: PropTypes.object.isRequired,
  unitPrice: PropTypes.number.isRequired,
  album: PropTypes.object.isRequired,
  afterTrackUpdate: PropTypes.func.isRequired,
};

EditAction.defaultProps = {
  composer: undefined,
};

export { EditAction };
