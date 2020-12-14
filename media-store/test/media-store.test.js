const { GET, POST, expect } = require("../../test").run("media-store");
const cds = require("@sap/cds/lib");
const {
  FIRST_TRACK,
  ALL_ALBUMS_WITH_TRACKS_BY_ARTIST,
  SECOND_CUSTOMER,
  FOURTH_MARKED_TRACK_FOR_SECOND_CUSTOMER,
  SECOND_CUSTOMER_INVOICES,
} = require("./data/media-store.mock");

const fs = require("fs");

const DEFAULT_CONFIG = {
  headers: { "content-type": "application/json" },
};

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

  before("login user", async () => {
    customerLoginResponse = await POST(
      "/users/login",
      {
        email: CURRENT_CUSTOMER_DATA.email,
        password: CURRENT_CUSTOMER_DATA.password,
      },
      DEFAULT_CONFIG
    );
    customerAccessToken = customerLoginResponse.data.accessToken;

    employeeLoginResponse = await POST(
      "/users/login",
      {
        email: CURRENT_EMPLOYEE_DATA.email,
        password: CURRENT_EMPLOYEE_DATA.password,
      },
      DEFAULT_CONFIG
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
          DEFAULT_CONFIG
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
        DEFAULT_CONFIG
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
          DEFAULT_CONFIG
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
            ...DEFAULT_CONFIG.headers,
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
            ...DEFAULT_CONFIG.headers,
            authorization: "Basic " + employeeAccessToken,
          },
        });
      } catch (error) {
        expect(error.message).to.equal("403 - Forbidden");
      }
    });

    it("current customer shouldn't retrieve his data without provided access token", async () => {
      try {
        await GET(`/users/Customers(11)`, DEFAULT_CONFIG);
      } catch (error) {
        expect(error.message).to.equal("401 - Unauthorized");
      }
    });

    it("current customer shouldn't retrieve another customer data", async () => {
      try {
        await GET(`/users/Customers(11)`, {
          headers: {
            ...DEFAULT_CONFIG.headers,
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
          ...DEFAULT_CONFIG.headers,
          authorization: "Basic " + customerAccessToken,
        },
      });

      expect(data).to.eql(FOURTH_MARKED_TRACK_FOR_SECOND_CUSTOMER);
    });
  });

  describe("BrowseInvoices", () => {
    async function getAllCustomerInvoices() {
      const { data } = await GET("/browse-invoices/Invoices", {
        headers: {
          ...DEFAULT_CONFIG.headers,
          authorization: "Basic " + customerAccessToken,
        },
      });
      return data;
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

      await POST(
        "/browse-invoices/invoice",
        { tracks: [{ ID: 3 }] },
        {
          headers: {
            ...DEFAULT_CONFIG.headers,
            authorization: "Basic " + customerAccessToken,
          },
        }
      );

      const afterData = await getAllCustomerInvoices();
      expect(afterData.value.length).to.equal(
        SECOND_CUSTOMER_INVOICES.value.length + 1
      );
    });
  });
});
