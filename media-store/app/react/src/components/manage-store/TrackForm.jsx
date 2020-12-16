import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, InputNumber } from 'antd';
import { head } from 'lodash';
import { useSearch } from '@umijs/hooks';
import { useAppState } from '../../hooks/useAppState';
import { fetchAlbumsByName, fetchGenres } from '../../api/calls';
import { useErrors } from '../../hooks/useErrors';

const ALBUMS_LIMIT = 10;
const REQUIRED = [
  {
    required: true,
    message: 'This filed is required!',
  },
];

function getAlbums(value) {
  return fetchAlbumsByName(value, ALBUMS_LIMIT)
    .then((response) => response.data.value)
    .catch(this.handleError);
}

const TrackForm = ({ initialAlbumTitle }) => {
  const { handleError } = useErrors();
  const {
    data: albums,
    loading: isAlbumsLoading,
    onChange: onChangeAlbumInput,
    cancel: onAlbumCancel,
  } = useSearch(getAlbums.bind({ handleError }));
  const { setLoading } = useAppState();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchGenres(), onChangeAlbumInput(initialAlbumTitle)])
      .then((responses) => setGenres(head(responses).data.value))
      .catch(handleError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Form.Item label="Name" name="name" rules={REQUIRED}>
        <Input />
      </Form.Item>
      <Form.Item label="Composer" name="composer" rules={REQUIRED}>
        <Input />
      </Form.Item>
      <Form.Item label="Album" name="albumID" rules={REQUIRED}>
        <Select
          showSearch
          placeholder="Select album"
          filterOption={false}
          onSearch={onChangeAlbumInput}
          loading={isAlbumsLoading}
          onBlur={onAlbumCancel}
        >
          {albums &&
            albums.map((album) => (
              <Select.Option key={album.title} value={album.ID}>
                {album.title}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Genre" name="genreID" rules={REQUIRED}>
        <Select showSearch placeholder="Select genre" filterOption={false}>
          {genres &&
            genres.map((genre) => (
              <Select.Option key={genre.name} value={genre.ID}>
                {genre.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Unit price" name="unitPrice" precision={2} rules={REQUIRED}>
        <InputNumber
          precision={2}
          decimalSeparator="."
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>
    </div>
  );
};

TrackForm.propTypes = {
  initialAlbumTitle: PropTypes.string,
};
TrackForm.defaultProps = {
  initialAlbumTitle: undefined,
};

export { TrackForm };
