import { isEmpty } from "lodash";
import axios from "axios";

const BROWSE_TRACKS_SERVICE = `api/browse-tracks`;
const INVOICES_SERVICE = `api/browse-invoices`;
const USER_SERVICE = `api/users`;
const MANAGE_STORE = `api/manage-store`;

const constructGenresQuery = (genreIds) => {
  return !isEmpty(genreIds)
    ? " and " + genreIds.map((value) => `genre_ID eq ${value}`).join(" or ")
    : "";
};

const fetchTacks = ({
  $top = 20,
  $skip = 0,
  genreIds = [],
  substr = "",
} = {}) => {
  const serializeTracksUrl = () => {
    return `$expand=genre,album($expand=artist)&$top=${$top}&$skip=${$skip}&$filter=${
      `contains(name,'${substr}')` + constructGenresQuery(genreIds)
    }`;
  };

  return axios.get(`${BROWSE_TRACKS_SERVICE}/${axios.defaults.tracksEntity}`, {
    params: {},
    paramsSerializer: () => serializeTracksUrl(),
  });
};

const countTracks = ({ genreIds = [], substr = "" } = {}) => {
  return axios.get(
    `${BROWSE_TRACKS_SERVICE}/${axios.defaults.tracksEntity}/$count?$filter=${
      `contains(name,'${substr}')` + constructGenresQuery(genreIds)
    }`
  );
};

const fetchGenres = () => {
  return axios.get(`${BROWSE_TRACKS_SERVICE}/Genres`);
};

const invoice = (tracks) => {
  return axios.post(
    `${INVOICES_SERVICE}/invoice`,
    {
      tracks: tracks.map(({ unitPrice, ID }) => ({
        unitPrice: `${unitPrice}`,
        ID,
      })),
    },
    {
      headers: { "content-type": "application/json;IEEE754Compatible=true" },
    }
  );
};

const fetchPerson = () => {
  return axios.get(`${USER_SERVICE}/${axios.defaults.userEntity}`);
};

const confirmPerson = (person) => {
  return axios.put(
    `${USER_SERVICE}/${axios.defaults.userEntity}`,
    {
      ...person,
    },
    {
      headers: { "content-type": "application/json" },
    }
  );
};

const fetchInvoices = () => {
  return axios.get(
    `${INVOICES_SERVICE}/Invoices?$expand=invoiceItems($expand=track($expand=album($expand=artist)))`
  );
};

const cancelInvoice = (ID) => {
  return axios.post(
    `${INVOICES_SERVICE}/cancelInvoice`,
    {
      ID,
    },
    {
      headers: { "content-type": "application/json" },
    }
  );
};

const fetchAlbumsByName = (substr = "", top) => {
  return axios.get(
    `${BROWSE_TRACKS_SERVICE}/Albums?$filter=${`contains(title,'${substr}')&$top=${top}`}`
  );
};

const addTrack = (data) => {
  return axios.post(`${MANAGE_STORE}/Tracks`, data, {
    headers: { "content-type": "application/json" },
  });
};

const addArtist = (data) => {
  return axios.post(`${MANAGE_STORE}/Artists`, data, {
    headers: { "content-type": "application/json" },
  });
};

const addAlbum = (data) => {
  return axios.post(`${MANAGE_STORE}/Albums`, data, {
    headers: { "content-type": "application/json" },
  });
};

const fetchArtistsByName = (substr = "", top) => {
  return axios.get(
    `${MANAGE_STORE}/Artists?$filter=${`contains(name,'${substr}')&$top=${top}`}`
  );
};

const login = (data) => {
  return axios.post(`${USER_SERVICE}/login`, data, {
    headers: { "content-type": "application/json" },
  });
};

const updateTrack = (track) => {
  return axios.put(
    `${MANAGE_STORE}/Tracks/${track.ID}`,
    {
      ...track,
    },
    {
      headers: { "content-type": "application/json" },
    }
  );
};

const getTrack = (ID) => {
  return axios.get(
    `${BROWSE_TRACKS_SERVICE}/${axios.defaults.tracksEntity}/${ID}?$expand=genre,album($expand=artist)`
  );
};

const deleteTrack = (ID) => {
  return axios.delete(`${MANAGE_STORE}/Tracks(${ID})`);
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
