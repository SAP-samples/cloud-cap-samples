const { GET, POST, expect } = require("../../test").run("media-store");
const cds = require("@sap/cds/lib");

class MockedUser extends cds.User {
  constructor(attr, roles, id) {
    super({ attr, _roles: [...roles], id });
  }
}

const {
  FIRST_TRACK,
  ALL_ALBUMS_WITH_TRACKS_BY_ARTIST,
} = require("./data/media-store.mock");

describe("Media Store services", () => {
  before("skipping auth", () => {
    cds.User = cds.User.Privileged; // skip auth
  });

  it("should bootstrap the services successfully", () => {
    const { BrowseTracks, db } = cds.services;
    const { Tracks } = BrowseTracks.entities;

    expect(BrowseTracks).not.to.be.undefined;
    expect(db).not.to.be.undefined;
    expect(Tracks).not.to.be.undefined;
  });

  describe("Tracks", () => {
    it("should return track with ID eq 1", async () => {
      const { data } = await GET(
        "/browse-tracks/Tracks(1)?$expand=genre,album($expand=artist)"
      );
      expect(data).to.eql(FIRST_TRACK);
    });
  });

  describe("Albums", () => {
    it("should return all albums with tracks by artist", async () => {
      const { data } = await GET(
        `/browse-tracks/Albums?$filter=artist_ID eq 1&$expand=tracks`
      );
      expect(data).to.eql(ALL_ALBUMS_WITH_TRACKS_BY_ARTIST);
    });
  });
});
