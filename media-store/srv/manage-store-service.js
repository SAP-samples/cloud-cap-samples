const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  const { Genres, Albums } = db.entities;

  this.before("*", (req) => {
    console.log(
      "[USER]:",
      req.user.id,
      " [LEVEL]: ",
      req.user.attr.level,
      "[ROLE]",
      req.user.is("user") ? "user" : "other"
    );
  });

  this.on("addTrack", async (req) => {
    const { albumTitle, genreName, name: trackName, composer } = req.data;

    const genre = await db.run(SELECT.one(Genres).where({ name: genreName }));
    const album = await db.run(SELECT.one(Albums).where({ title: albumTitle }));
    // todo impl
  });
};
