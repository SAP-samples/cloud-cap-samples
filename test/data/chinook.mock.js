const FIRST_TRACK = {
  "@odata.context": "$metadata#Tracks(genre(),album(artist()))/$entity",
  ID: 1,
  name: "For Those About To Rock (We Salute You)",
  composer: "Angus Young, Malcolm Young, Brian Johnson",
  unitPrice: 0.99,
  album_ID: 1,
  genre_ID: 1,
  album: {
    ID: 1,
    title: "For Those About To Rock We Salute You",
    artist_ID: 1,
    artist: {
      ID: 1,
      name: "AC/DC",
    },
  },
  genre: {
    ID: 1,
    name: "Rock",
  },
};

const SECOND_CUSTOMER = {
  "@odata.context": "$metadata#Customers/$entity",
  ID: 2,
  lastName: "Köhler",
  firstName: "Leonie",
  city: "Stuttgart",
  address: "Theodor-Heuss-Straße 34",
  country: "Germany",
  phone: "+49 0711 2842222",
  email: "leonekohler@surfeu.de",
};

const FOURTH_MARKED_TRACK_FOR_SECOND_CUSTOMER = {
  "@odata.context": "$metadata#MarkedTracks/$entity",
  ID: 4,
  name: "Restless and Wild",
  composer:
    "F. Baltes, R.A. Smith-Diesel, S. Kaufman, U. Dirkscneider & W. Hoffman",
  unitPrice: 0.99,
  alreadyOrdered: true,
  album_ID: 3,
  genre_ID: 1,
};

const SECOND_CUSTOMER_INVOICES = {
  "@odata.context": "$metadata#Invoices",
  value: [
    {
      ID: 1,
      invoiceDate: "2008-12-31T22:00:00Z",
      total: 1.98,
      status: 1,
      customer_ID: 2,
    },
    {
      ID: 12,
      invoiceDate: "2009-02-10T22:00:00Z",
      total: 13.86,
      status: 1,
      customer_ID: 2,
    },
    {
      ID: 67,
      invoiceDate: "2009-10-11T21:00:00Z",
      total: 8.91,
      status: 1,
      customer_ID: 2,
    },
    {
      ID: 196,
      invoiceDate: "2011-05-18T21:00:00Z",
      total: 1.98,
      status: 1,
      customer_ID: 2,
    },
    {
      ID: 219,
      invoiceDate: "2011-08-20T21:00:00Z",
      total: 3.96,
      status: 1,
      customer_ID: 2,
    },
    {
      ID: 241,
      invoiceDate: "2011-11-22T21:00:00Z",
      total: 5.94,
      status: 1,
      customer_ID: 2,
    },
    {
      ID: 293,
      invoiceDate: "2012-07-12T21:00:00Z",
      total: 0.99,
      status: 1,
      customer_ID: 2,
    },
  ],
};

module.exports = {
  FIRST_TRACK,
  SECOND_CUSTOMER,
  FOURTH_MARKED_TRACK_FOR_SECOND_CUSTOMER,
  SECOND_CUSTOMER_INVOICES,
};
