const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  const { Albums, Tracks, Artists } = db.entities;

  this.before("CREATE", "Tracks", async (req) => {
    let { ID: lastTrackId } = await db.run(
      SELECT.one(Tracks).columns("ID").orderBy({ ID: "desc" })
    );
    req.data = { ...req.data, ID: ++lastTrackId };
  });
  this.before("CREATE", "Artists", async (req) => {
    let { ID: lastArtistId } = await db.run(
      SELECT.one(Artists).columns("ID").orderBy({ ID: "desc" })
    );
    req.data = { ...req.data, ID: ++lastArtistId };
  });
  this.before("CREATE", "Albums", async (req) => {
    let { ID: lastAlbumId } = await db.run(
      SELECT.one(Albums).columns("ID").orderBy({ ID: "desc" })
    );
    req.data = { ...req.data, ID: ++lastAlbumId };
  });
};
