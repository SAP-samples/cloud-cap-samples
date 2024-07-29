const cds = require("@sap/cds");
const { expect } = cds.test(
  "serve",
  "CatalogService",
  "--from",
  "@capire/bookshop,@capire/common",
  "--in-memory"
);

describe("Consuming actions locally", () => {
  let cats, CatalogService, Books, tx, stockBefore;
  const BOOK_ID = 251;
  const QUANTITY = 1;

  before("bootstrap the database", async () => {
    CatalogService = cds.services.CatalogService;
    expect(CatalogService).not.to.be.undefined;

    Books = CatalogService.entities.Books;
    expect(Books).not.to.be.undefined;

    cats = await cds.connect.to("CatalogService");
  });

  beforeEach(async () => {
    // Read the stock before the action is called
    stockBefore = (await cats.get(Books, BOOK_ID)).stock;
  });

  it("calls unbound actions - basic variant using srv.send", async () => {
    // Use a managed transaction to create a continuation with an authenticated user
    const res1 = await cats.tx({ user: "alice" }, () => {
      return cats.send("submitOrder", { book: BOOK_ID, quantity: QUANTITY });
    });
    expect(res1.stock).to.eql(stockBefore - QUANTITY);
  });

  it("calls unbound actions - named args variant", async () => {
    // Use a managed transaction to create a continuation with an authenticated user
    const res2 = await cats.tx({ user: "alice" }, () => {
      return cats.submitOrder({ book: BOOK_ID, quantity: QUANTITY });
    });
    expect(res2.stock).to.eql(stockBefore - QUANTITY);
  });

  it("calls unbound actions - positional args variant", async () => {
    // Use a managed transaction to create a continuation with an authenticated user
    const res3 = await cats.tx({ user: "alice" }, () => {
      return cats.submitOrder(BOOK_ID, QUANTITY);
    });
    expect(res3.stock).to.eql(stockBefore - QUANTITY);
  });
});
