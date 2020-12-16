const { GET, POST, expect } = require("../../test").run("media-store");
const cds = require("@sap/cds/lib");
const {
  FIRST_TRACK,
  SECOND_CUSTOMER,
  FOURTH_MARKED_TRACK_FOR_SECOND_CUSTOMER,
  SECOND_CUSTOMER_INVOICES,
} = require("./data/media-store.mock");

const DEFAULT_AXIOS_CONFIG = {
  headers: { "content-type": "application/json" },
};

async function resetStore() {
  const targetCSNModel = await cds.load(["db", "srv"]);
  const model = cds.reflect(targetCSNModel);
  await cds.deploy(model).to("sqlite:mychinook.db");
}

describe("Media Store services", () => {
  const CURRENT_CUSTOMER_DATA = {
    ID: 2,
    email: "leonekohler@surfeu.de",
    password: "some",
    roles: ["customer"],
  };
  const CURRENT_EMPLOYEE_DATA = {
    ID: 4,
    email: "margaret@chinookcorp.com",
    password: "some",
    roles: ["employee"],
  };
  let customerAccessToken;
  let employeeAccessToken;

  beforeEach("reset store per each test", async () => {
    await resetStore();
  });

  before("login user", async () => {
    customerLoginResponse = await POST(
      "/users/login",
      {
        email: CURRENT_CUSTOMER_DATA.email,
        password: CURRENT_CUSTOMER_DATA.password,
      },
      DEFAULT_AXIOS_CONFIG
    );
    customerAccessToken = customerLoginResponse.data.accessToken;

    employeeLoginResponse = await POST(
      "/users/login",
      {
        email: CURRENT_EMPLOYEE_DATA.email,
        password: CURRENT_EMPLOYEE_DATA.password,
      },
      DEFAULT_AXIOS_CONFIG
    );
    employeeAccessToken = employeeLoginResponse.data.accessToken;
  });

  it("should bootstrap services successfully", () => {
    const {
      BrowseTracks,
      BrowseInvoices,
      ManageStore,
      Users,
      db,
    } = cds.services;
    const { Tracks } = BrowseTracks.entities;

    expect(BrowseTracks).not.to.be.undefined;
    expect(BrowseInvoices).not.to.be.undefined;
    expect(ManageStore).not.to.be.undefined;
    expect(Users).not.to.be.undefined;
    expect(db).not.to.be.undefined;
    expect(Tracks).not.to.be.undefined;
  });

  describe("Users", () => {
    function compareAuthData(actualAuthData) {
      expect(actualAuthData).not.to.be.undefined;
      expect(actualAuthData).to.have.own.property("accessToken");
      expect(actualAuthData).to.have.own.property("refreshToken");
      expect(actualAuthData).to.have.own.property("ID");
      expect(actualAuthData).to.have.own.property("email");
      expect(actualAuthData).to.have.own.property("roles");
      expect(actualAuthData.ID).to.equal(CURRENT_CUSTOMER_DATA.ID);
      expect(actualAuthData.email).to.equal(CURRENT_CUSTOMER_DATA.email);
      expect(actualAuthData.roles).to.deep.equal(CURRENT_CUSTOMER_DATA.roles);
    }

    it("should login user successfully", async () => {
      const { data: actualData } = customerLoginResponse;

      compareAuthData(actualData);
    });

    it("shouldn't login customer with invalid credentials", async () => {
      try {
        await POST(
          "/users/login",
          {
            email: CURRENT_CUSTOMER_DATA.email,
            password: "some-invalid-password",
          },
          DEFAULT_AXIOS_CONFIG
        );
      } catch (error) {
        expect(error.message).to.equal("401 - Unauthorized");
      }
    });

    it("should refresh tokens successfully", async () => {
      const {
        data: { refreshToken },
      } = customerLoginResponse;
      const { data: actualRefreshTokensData } = await POST(
        "/users/refreshTokens",
        {
          refreshToken,
        },
        DEFAULT_AXIOS_CONFIG
      );

      compareAuthData(actualRefreshTokensData);
    });

    it("shouldn't refresh tokens due to invalid provided one", async () => {
      try {
        await POST(
          "/users/refreshTokens",
          {
            refreshToken: "some-invalid-refresh-token",
          },
          DEFAULT_AXIOS_CONFIG
        );
      } catch (error) {
        expect(error.message).to.equal("401 - Unauthorized");
      }
    });

    it("current customer should retrieve his data", async () => {
      const { data: actualData } = await GET(
        `/users/Customers(${CURRENT_CUSTOMER_DATA.ID})`,
        {
          headers: {
            authorization: "Basic " + customerAccessToken,
          },
        }
      );
      expect(actualData).not.to.be.undefined;
      expect(actualData).to.deep.equal(SECOND_CUSTOMER);
    });

    it("current employee shouldn't have access to customer data", async () => {
      const someCustomerID = 15;

      try {
        await GET(`/users/Customers(${someCustomerID})`, {
          headers: {
            authorization: "Basic " + employeeAccessToken,
          },
        });
      } catch (error) {
        expect(error.message).to.equal("403 - Forbidden");
      }
    });

    it("current customer shouldn't retrieve his data without provided access token", async () => {
      try {
        await GET(`/users/Customers(11)`, DEFAULT_AXIOS_CONFIG);
      } catch (error) {
        expect(error.message).to.equal("401 - Unauthorized");
      }
    });

    it("current customer shouldn't retrieve another customer data", async () => {
      try {
        await GET(`/users/Customers(11)`, {
          headers: {
            authorization: "Basic " + customerAccessToken,
          },
        });
      } catch (error) {
        expect(error.message).to.equal("404 - Not Found");
      }
    });
  });

  describe("BrowseTracks", () => {
    it("should return track with ID eq 1", async () => {
      const { data } = await GET(
        "/browse-tracks/Tracks(1)?$expand=genre,album($expand=artist)"
      );
      expect(data).to.eql(FIRST_TRACK);
    });

    it("should return track with ID eq 4 for second customer", async () => {
      const { data } = await GET("/browse-tracks/MarkedTracks(4)", {
        headers: {
          authorization: "Basic " + customerAccessToken,
        },
      });

      expect(data).to.eql(FOURTH_MARKED_TRACK_FOR_SECOND_CUSTOMER);
    });
  });

  describe("BrowseInvoices", () => {
    const NEW_INVOICE_ID = 413;
    const CANCELLED_STATUS = -1;

    async function getAllCustomerInvoices() {
      const { data } = await GET("/browse-invoices/Invoices", {
        headers: {
          authorization: "Basic " + customerAccessToken,
        },
      });
      return data;
    }

    async function createInvoice(tracks) {
      await POST(
        "/browse-invoices/invoice",
        { tracks },
        {
          headers: {
            ...DEFAULT_AXIOS_CONFIG.headers,
            authorization: "Basic " + customerAccessToken,
          },
        }
      );
    }

    it("should return all invoices only for current customer", async () => {
      const data = await getAllCustomerInvoices();

      expect(data).to.eql(SECOND_CUSTOMER_INVOICES);
    });

    it("should create invoice for current customer", async () => {
      const beforeData = await getAllCustomerInvoices();
      expect(beforeData.value.length).to.equal(
        SECOND_CUSTOMER_INVOICES.value.length
      );

      await createInvoice([{ ID: 3 }]);

      const afterData = await getAllCustomerInvoices();
      expect(afterData.value.length).to.equal(
        SECOND_CUSTOMER_INVOICES.value.length + 1
      );
    });

    it("should not create invoice due to current customer already owns some of provided tracks", async () => {
      const ALREADY_OWNED_TRACK_ID = 4;

      try {
        await createInvoice([{ ID: ALREADY_OWNED_TRACK_ID }]);
      } catch (error) {
        expect(error.message).to.equal(
          "400 - Invoice contains already owned values"
        );
      }
    });

    it("should cancel invoice for current customer", async () => {
      await createInvoice([{ ID: 3 }]);

      const beforeData = await getAllCustomerInvoices();
      expect(beforeData.value.length).to.equal(
        SECOND_CUSTOMER_INVOICES.value.length + 1
      );

      await POST(
        "/browse-invoices/cancelInvoice",
        { ID: NEW_INVOICE_ID },
        {
          headers: {
            ...DEFAULT_AXIOS_CONFIG.headers,
            authorization: "Basic " + customerAccessToken,
          },
        }
      );

      const afterData = await getAllCustomerInvoices();
      expect(afterData.value[afterData.value.length - 1].status).to.equal(
        CANCELLED_STATUS
      );
    });

    it("should not cancel invoice due to leverage time has expired", async () => {
      const beforeData = await getAllCustomerInvoices();
      expect(beforeData.value.length).to.equal(
        SECOND_CUSTOMER_INVOICES.value.length
      );

      try {
        await POST(
          "/browse-invoices/cancelInvoice",
          { ID: 12 },
          {
            headers: {
              ...DEFAULT_AXIOS_CONFIG.headers,
              authorization: "Basic " + customerAccessToken,
            },
          }
        );
      } catch (error) {
        expect(error.message).to.equal("400 - Leverage time was expired");
      }
    });

    it("should not cancel invoice due to invoice with such ID si not belongs to current customer", async () => {
      const NOT_OWNED_INVOICE_ID = 146;

      try {
        await POST(
          "/browse-invoices/cancelInvoice",
          { ID: NOT_OWNED_INVOICE_ID },
          {
            headers: {
              ...DEFAULT_AXIOS_CONFIG.headers,
              authorization: "Basic " + customerAccessToken,
            },
          }
        );
      } catch (error) {
        expect(error.message).to.equal(
          "404 - Seems like you are not owning this invoice or it is not exists"
        );
      }
    });
  });

  describe("ManageStore", () => {
    const NEW_TRACK_ID = 3504;
    const newTrack = {
      name: "Some track",
      composer: "Some composer",
      album: { ID: 14 },
      genre: { ID: 15 },
      unitPrice: "18.33",
    };

    async function createTrack(newTrack) {
      await POST("/manage-store/Tracks", newTrack, {
        headers: {
          authorization: "Basic " + employeeAccessToken,
          "content-type": "application/json;IEEE754Compatible=true",
        },
      });
    }

    async function getTrack(ID) {
      return await GET(`/browse-tracks/Tracks(${ID})`);
    }

    it("should create new track", async () => {
      await createTrack(newTrack);
      const { data: createdTrack } = await getTrack(NEW_TRACK_ID);

      expect(createdTrack).to.deep.equal({
        "@odata.context": "$metadata#Tracks/$entity",
        ID: NEW_TRACK_ID,
        name: "Some track",
        composer: "Some composer",
        unitPrice: 18.33,
        album_ID: 14,
        genre_ID: 15,
      });
    });

    it("customer should can create track", async () => {
      try {
        await POST("/manage-store/Tracks", newTrack, {
          headers: {
            authorization: "Basic " + customerAccessToken,
            "content-type": "application/json;IEEE754Compatible=true",
          },
        });
      } catch (error) {
        expect(error.message).to.equal("403 - Forbidden");
      }
    });

    it("should create new artist", async () => {
      const NEW_ARTIST_ID = 276;

      await POST(
        "/manage-store/Artists",
        { name: "some" },
        {
          headers: {
            authorization: "Basic " + employeeAccessToken,
            ...DEFAULT_AXIOS_CONFIG.headers,
          },
        }
      );

      const { data } = await GET(`/manage-store/Artists(${NEW_ARTIST_ID})`, {
        headers: {
          authorization: "Basic " + employeeAccessToken,
        },
      });

      expect({
        ID: NEW_ARTIST_ID,
        name: "some",
        "@odata.context": "$metadata#Artists/$entity",
      }).to.deep.equal(data);
    });

    it("should create new artist", async () => {
      const NEW_ALBUM_ID = 349;

      await POST(
        "/manage-store/Albums",
        { title: "some", artist: { ID: 235 } },
        {
          headers: {
            authorization: "Basic " + employeeAccessToken,
            ...DEFAULT_AXIOS_CONFIG.headers,
          },
        }
      );

      const { data } = await GET(`/manage-store/Albums(${NEW_ALBUM_ID})`, {
        headers: {
          authorization: "Basic " + employeeAccessToken,
        },
      });
      expect({
        ID: NEW_ALBUM_ID,
        title: "some",
        artist_ID: 235,
        "@odata.context": "$metadata#Albums/$entity",
      }).to.deep.equal(data);
    });
  });
});
