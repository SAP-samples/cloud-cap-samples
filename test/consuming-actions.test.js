const cds = require("@sap/cds/lib");
const { expect } = cds.test(
  "serve",
  "CatalogService",
  "--from",
  "@capire/bookshop,@capire/common",
  "--in-memory"
);

describe("Consuming actions locally", () => {
  let cats;

  before("bootstrap the database", async () => {
    const { CatalogService } = cds.services;
    expect(CatalogService).not.to.be.undefined;

    const { Books } = CatalogService.entities;
    expect(Books).not.to.be.undefined;

    cats = await cds.connect.to("CatalogService");
  });

  it("calls unbound actions - basic variant using srv.send", async () => {
    const res1 = await cats.send("submitOrder", {
      book: 111,
      quantity: 1,
    });
  });

  it("calls unbound actions - named args variant", async () => {
    const res2 = await cats.submitOrder({ book: 111, quantity: 1 });
  });

  it("calls unbound actions - positional args variant", async () => {
    const res3 = await cats.submitOrder(111, 1);
  });
});
