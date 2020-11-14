import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Input, Col, Row, Select, Pagination } from "antd";
import { Track } from "./Track";
import "./TracksPage.css";
import { useGlobals } from "../../GlobalContext";
import { useErrors } from "../../useErrors";
import { fetchTacks, countTracks, fetchGenres } from "../../api-service";

const { Search } = Input;
const { Option } = Select;

const DEBOUNCE_TIMER = 500;
const DEBOUNCE_OPTIONS = {
  leading: true,
  trailing: false,
};

const renderGenres = (genres) =>
  genres.map(({ ID, name }) => (
    <Option key={ID} value={ID.toString()}>
      {name}
    </Option>
  ));

const TracksContainer = () => {
  const { setLoading, invoicedItems } = useGlobals();
  const { handleError } = useErrors();
  const [state, setState] = useState({
    tracks: [],
    genres: [],
    pagination: {
      currentPage: 1,
      totalItems: 0,
      pageSize: 20,
    },
    searchOptions: {
      substr: "",
      genreIds: [],
    },
  });

  useEffect(() => {
    setLoading(true);

    const countTracksReq = countTracks();
    const getTracksRequest = fetchTacks();
    const getGenresReq = fetchGenres();

    Promise.all([countTracksReq, getTracksRequest, getGenresReq])
      .then((responses) => {
        const [
          { data: totalItems },
          {
            data: { value: tracks },
          },
          {
            data: { value: genres },
          },
        ] = responses;
        setState({
          ...state,
          tracks,
          genres,
          pagination: { ...state.pagination, totalItems },
        });
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  const onSearch = debounce(
    () => {
      setLoading(true);
      const options = {
        $top: state.pagination.pageSize,
        substr: state.searchOptions.substr,
        genreIds: state.searchOptions.genreIds,
      };

      Promise.all([
        fetchTacks(options),
        countTracks({
          substr: options.substr,
          genreIds: options.genreIds,
        }),
      ])
        .then((responses) => {
          const [
            {
              data: { value: tracks },
            },
            { data: totalItems },
          ] = responses;
          setState({
            ...state,
            tracks,
            pagination: { ...state.pagination, totalItems },
          });
          setLoading(false);
        })
        .catch(handleError);
    },
    DEBOUNCE_TIMER,
    DEBOUNCE_OPTIONS
  );
  const onSelectChange = (genres) => {
    setState({
      ...state,
      searchOptions: {
        ...state.searchOptions,
        genreIds: genres.map((value) => parseInt(value, 10)),
      },
    });
  };
  const onSearchChange = (event) => {
    setState({
      ...state,
      searchOptions: { ...state.searchOptions, substr: event.target.value },
    });
  };
  const onChangePage = (pageNumber) => {
    document
      .querySelector("section.ant-layout")
      .scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setLoading(true);

    const options = {
      $top: state.pagination.pageSize,
      substr: state.searchOptions.substr,
      genreIds: state.searchOptions.genreIds,
      $skip: (pageNumber - 1) * state.pagination.pageSize,
    };
    fetchTacks(options)
      .then((response) => {
        setState({
          ...state,
          tracks: response.data.value,
          pagination: { ...state.pagination, currentPage: pageNumber },
        });
        setLoading(false);
      })
      .catch(handleError);
  };
  const deleteTrack = (ID) => {
    setState({
      ...state,
      tracks: state.tracks.filter(({ ID: curID }) => curID !== ID),
    });
  };
  const renderTracks = (tracks, invoicedItems) =>
    tracks.map(
      ({ ID, name, composer, genre, unitPrice, alreadyOrdered, album }) => (
        <Col key={ID} className="gutter-row" span={8}>
          <Track
            initialTrack={{
              ID,
              name,
              genre,
              album,
              artist: album.artist.name,
              composer,
              unitPrice,
            }}
            isButtonVisible={!alreadyOrdered}
            isInvoiced={invoicedItems.find(({ ID: curID }) => curID === ID)}
            onDeleteTrack={(ID) => deleteTrack(ID)}
          />
        </Col>
      )
    );

  const trackElements = renderTracks(state.tracks, invoicedItems);
  const genreElements = renderGenres(state.genres);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          maxWidth: 600,
          paddingBottom: 10,
        }}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ marginRight: 10, borderRadius: 6 }}
          placeholder="Genres"
          onChange={(value) => onSelectChange(value)}
        >
          {genreElements}
        </Select>
        <Search
          style={{
            borderRadius: 6,
          }}
          placeholder="Search tracks"
          size="large"
          onSearch={onSearch}
          onChange={onSearchChange}
        />
      </div>
      <div>
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 24]}>
          {trackElements}
        </Row>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          showSizeChanger={false}
          defaultCurrent={1}
          total={state.pagination.totalItems}
          pageSize={state.pagination.pageSize}
          onChange={onChangePage}
        />
      </div>
    </>
  );
};

export { TracksContainer };
