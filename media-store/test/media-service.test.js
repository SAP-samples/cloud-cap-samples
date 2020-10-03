const cds = require("../../test/cds");
const { GET, expect } = cds.test("media-store").in(__dirname, "../../");

const {
  FIRST_EMPLOYEE,
  SECOND_EMPLOYEE_WITH_EXPANDED_FIELDS,
  ALL_ALBUMS_WITH_TRACKS_BY_ARTIST,
  CUSTOMER_WITH_THEIR_SUPPORT_REP,
  EIGHTH_ALBUM_TRACKS_COUNT,
} = require("./data/media-service.mock");

describe("Media service", () => {
  it("should bootstrap the services successfully", () => {
    const { MediaService, db } = cds.services;
    const { Employees } = MediaService.entities;

    expect(MediaService).not.to.be.undefined;
    expect(db).not.to.be.undefined;
    expect(Employees).not.to.be.undefined;
  });

  describe("Employees", () => {
    it("should return employee (ID=1)", async () => {
      const { data } = await GET("/media/Employees(1)");
      expect(data).to.eql(FIRST_EMPLOYEE);
    });

    it("should return employee (ID=2) with subordinates and whom he reports to", async () => {
      const { data } = await GET(
        `/media/Employees(2)?$expand=subordinates,reportsTo`
      );
      expect(data).to.eql(SECOND_EMPLOYEE_WITH_EXPANDED_FIELDS);
    });
  });

  describe("Albums", () => {
    it("should return all albums with tracks by artist", async () => {
      const { data } = await GET(
        `/media/Albums?$filter=artist_ID eq 1&$expand=tracks`
      );
      expect(data).to.eql(ALL_ALBUMS_WITH_TRACKS_BY_ARTIST);
    });
  });

  describe("Customers", () => {
    it("should return customer with their invoices", async () => {
      const { data } = await GET(`/media/Customers(1)?$expand=supportRep`);
      expect(data).to.eql(CUSTOMER_WITH_THEIR_SUPPORT_REP);
    });
  });

  describe("Playlists", () => {
    it("should return playlist with their tracks", async () => {
      const { data } = await GET(`/media/Customers(1)?$expand=supportRep`);
      expect(data).to.eql(CUSTOMER_WITH_THEIR_SUPPORT_REP);
    });
  });

  describe("Tracks", () => {
    it("should return the number of tracks by album", async () => {
      const { data } = await GET(
        `/media/PlaylistTrack/$count?$filter=playlist_ID eq 8`
      );
      expect(data).to.eql(EIGHTH_ALBUM_TRACKS_COUNT);
    });
  });
});
