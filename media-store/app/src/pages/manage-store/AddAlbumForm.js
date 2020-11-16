import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import { useSearch } from "@umijs/hooks";
import { useErrors } from "../../useErrors";
import { fetchArtistsByName } from "../../api-service";

const REQUIRED = [
  {
    required: true,
    message: "This filed is required!",
  },
];
const ARTISTS_LIMIT = 10;

const getArtists = function (value) {
  return fetchArtistsByName(value, ARTISTS_LIMIT)
    .then((response) => response.data.value)
    .catch(this.handleError);
};

const AddAlbumForm = () => {
  const { handleError } = useErrors();
  const {
    data: artists,
    loading: isArtistsLoading,
    onChange: onChangeArtistInput,
    cancel: onArtistCancel,
  } = useSearch(getArtists.bind({ handleError }));

  useEffect(() => {
    onChangeArtistInput();
  }, []);

  return (
    <>
      <h3>Add album</h3>
      <Form.Item label="Name" name="name" rules={REQUIRED}>
        <Input />
      </Form.Item>
      <Form.Item label="Artist" name="artistID" rules={REQUIRED}>
        <Select
          showSearch
          placeholder="Select artist"
          filterOption={false}
          onSearch={onChangeArtistInput}
          loading={isArtistsLoading}
          onBlur={onArtistCancel}
          style={{ width: 300 }}
        >
          {artists &&
            artists.map((artist) => (
              <Select.Option key={artist.name} value={artist.ID}>
                {artist.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
    </>
  );
};

export { AddAlbumForm };
