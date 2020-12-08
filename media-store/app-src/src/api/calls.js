import { isEmpty } from 'lodash';
import { axiosInstance } from './axiosInstance';

const BROWSE_TRACKS_SERVICE = 'browse-tracks';
const INVOICES_SERVICE = 'browse-invoices';
const USER_SERVICE = 'users';
const MANAGE_STORE = 'manage-store';

const constructGenresQuery = (genreIds) => {
  return !isEmpty(genreIds)
    ? ` and ${genreIds.map((value) => `genre_ID eq ${value}`).join(' or ')}`
    : '';
};

const fetchTacks = ({ $top = 20, $skip = 0, genreIds = [], substr = '' } = {}) => {
  const serializeTracksUrl = () => {
    return `$expand=genre,album($expand=artist)&$top=${$top}&$skip=${$skip}&$filter=${`contains(name,'${substr}')${constructGenresQuery(
      genreIds
    )}`}`;
  };

  return axiosInstance.get(`${BROWSE_TRACKS_SERVICE}/${axiosInstance.defaults.tracksEntity}`, {
    params: {},
    paramsSerializer: () => serializeTracksUrl(),
  });
};

const countTracks = ({ genreIds = [], substr = '' } = {}) => {
  const { tracksEntity } = axiosInstance.defaults;

  return axiosInstance.get(
    `${BROWSE_TRACKS_SERVICE}/${tracksEntity}/$count?$filter=${`contains(name,'${substr}')${constructGenresQuery(
      genreIds
    )}`}`
  );
};

const fetchGenres = () => {
  return axiosInstance.get(`${BROWSE_TRACKS_SERVICE}/Genres`);
};

const invoice = (tracks) => {
  return axiosInstance.post(
    `${INVOICES_SERVICE}/invoice`,
    {
      tracks,
    },
    {
      headers: { 'content-type': 'application/json' },
    }
  );
};

const fetchPerson = () => {
  return axiosInstance.get(`${USER_SERVICE}/${axiosInstance.defaults.userEntity}`);
};

const confirmPerson = (person) => {
  return axiosInstance.put(
    `${USER_SERVICE}/${axiosInstance.defaults.userEntity}`,
    {
      ...person,
    },
    {
      headers: { 'content-type': 'application/json' },
    }
  );
};

const fetchInvoices = () => {
  return axiosInstance.get(
    `${INVOICES_SERVICE}/Invoices?$expand=invoiceItems($expand=track($expand=album($expand=artist)))`
  );
};

const cancelInvoice = (ID) => {
  return axiosInstance.post(
    `${INVOICES_SERVICE}/cancelInvoice`,
    {
      ID,
    },
    {
      headers: { 'content-type': 'application/json' },
    }
  );
};

const fetchAlbumsByName = (substr = '', top) => {
  return axiosInstance.get(
    `${BROWSE_TRACKS_SERVICE}/Albums?$filter=${`contains(title,'${substr}')&$top=${top}`}`
  );
};

const addTrack = (data) => {
  return axiosInstance.post(`${MANAGE_STORE}/Tracks`, data, {
    headers: { 'content-type': 'application/json;IEEE754Compatible=true' },
  });
};

const addArtist = (data) => {
  return axiosInstance.post(`${MANAGE_STORE}/Artists`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

const addAlbum = (data) => {
  return axiosInstance.post(`${MANAGE_STORE}/Albums`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

const fetchArtistsByName = (substr = '', top) => {
  return axiosInstance.get(
    `${MANAGE_STORE}/Artists?$filter=${`contains(name,'${substr}')&$top=${top}`}`
  );
};

const login = (data) => {
  return axiosInstance.post(`${USER_SERVICE}/login`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

const updateTrack = (track) => {
  return axiosInstance.put(
    `${MANAGE_STORE}/Tracks/${track.ID}`,
    {
      ...track,
    },
    {
      headers: { 'content-type': 'application/json;IEEE754Compatible=true' },
    }
  );
};

const getTrack = (ID) => {
  return axiosInstance.get(
    `${BROWSE_TRACKS_SERVICE}/${axiosInstance.defaults.tracksEntity}/${ID}?$expand=genre,album($expand=artist)`
  );
};

const deleteTrack = (ID) => {
  return axiosInstance.delete(`${MANAGE_STORE}/Tracks(${ID})`);
};

export {
  fetchTacks,
  countTracks,
  fetchGenres,
  invoice,
  fetchPerson,
  confirmPerson,
  fetchInvoices,
  cancelInvoice,
  fetchAlbumsByName,
  addTrack,
  addArtist,
  addAlbum,
  fetchArtistsByName,
  login,
  updateTrack,
  getTrack,
  deleteTrack,
};
