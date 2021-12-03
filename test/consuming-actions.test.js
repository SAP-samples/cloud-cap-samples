const cds = require("@sap/cds/lib");
const { expect } = cds.test(
  "serve",
  "CatalogService",
  "--from",
  "@capire/bookshop,@capire/common",
  "--in-memory"
);

describe("Consuming actions locally", () => {
  let cats, tx;

  before("bootstrap the database", async () => {
    const { CatalogService } = cds.services;
    expect(CatalogService).not.to.be.undefined;

    const { Books } = CatalogService.entities;
    expect(Books).not.to.be.undefined;

    cats = await cds.connect.to("CatalogService");
  });


  beforeEach(async () => {
    // Use a manual transaction to create a continuation with an authenticated user
    tx = await cats.tx({user: "alice"});
  });

  it("calls unbound actions - basic variant using srv.send", async () => {
    const res1 = await tx.send("submitOrder", {
      book: 251,
      quantity: 1,
    });
  });

  it("calls unbound actions - named args variant", async () => {
    const res2 = await tx.submitOrder({ book: 251, quantity: 1 });
  });

  it("calls unbound actions - positional args variant", async () => {
    const res3 = await tx.submitOrder(251, 1);
  });
});
