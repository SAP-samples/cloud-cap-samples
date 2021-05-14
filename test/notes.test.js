const cds = require("@sap/cds/lib");
const express = require("express");
if (cds.User.default) cds.User.default = cds.User.Privileged;
// hard core monkey patch
else cds.User = cds.User.Privileged; // hard core monkey patch for older cds releases

// TODO: remove hack
process.env.S4_APIKEY = "-";

const envelope = (entity, value) => {
  const result = {"@odata.context": entity.match(/\$metadata/) ? entity : `$metadata#${entity}`};

  if (Array.isArray(value)) {
    result.value = value;
  } else {
    Object.assign(result, value);
  }
  return result;
}

const BPs = [
    {
      BusinessPartner: "11",
      BusinessPartnerFullName: "Alice Wonder",
      BusinessPartnerType: "CUSTOMER",
    },
    {
      BusinessPartner: "9980000082",
      BusinessPartnerFullName: "Hugo Hollandaise",
      BusinessPartnerType: "CUSTOMER",
    },
];

const Suppliers = [
    {
      ID: "11",
      fullName: "Alice Wonder",
      customerType: "CUSTOMER",
    },
    {
      ID: "9980000082",
      fullName: "Hugo Hollandaise",
      customerType: "CUSTOMER",
    },
  ];

const SuppliersExpandNotes = [
    {
      ID: "11",
      fullName: "Alice Wonder",
      customerType: "CUSTOMER",
      notes: [
        {
          ID: "545A3CF9-84CF-46C8-93DC-E29F0F2BC6BE",
          note: "note2 for 11",
          supplier_ID: "11",
        },
        {
          ID: "D632D4EE-E772-454A-913E-26A7B8DAA7FB",
          note: "note1 for 11",
          supplier_ID: "11",
        },
      ],
    },
    {
      ID: "9980000082",
      fullName: "Hugo Hollandaise",
      customerType: "CUSTOMER",
      notes: [
        {
          ID: "24B58115-E394-423B-BEAB-53419A32B927",
          note: "note3",
          supplier_ID: "9980000082",
        },
      ],
    },
  ];

const NotesExpandSuppliers = [
        {
            "ID": "24B58115-E394-423B-BEAB-53419A32B927",
            "note": "note3",
            "supplier_ID": "9980000082",
            "supplier": {
                "ID": "9980000082",
                "fullName": "Hugo Hollandaise",
                "customerType": "CUSTOMER"
            }
        },
        {
            "ID": "545A3CF9-84CF-46C8-93DC-E29F0F2BC6BE",
            "note": "note2 for 11",
            "supplier_ID": "11",
            "supplier": {
                "ID": "11",
                "fullName": "Alice Wonder",
                "customerType": "CUSTOMER"
            }
        },
        {
            "ID": "D632D4EE-E772-454A-913E-26A7B8DAA7FB",
            "note": "note1 for 11",
            "supplier_ID": "11",
            "supplier": {
                "ID": "11",
                "fullName": "Alice Wonder",
                "customerType": "CUSTOMER"
            }
        }
    ];

class MockServer {
  async start() {
    const http = require('http');

    this.app = express();
    this.server = http.createServer(this.app).listen();
    this.app.set('port', this.server.address().port);

    this.app.get("*", (req, res) => {
      res.writeHead(200);
      res.end(JSON.stringify(BPs));
    });
  }

  url() {
    return `http://localhost:${this.server.address().port}`;
  }

  close() {
    this.server.close();
  }
}

if (!global.beforeAll) global.beforeAll = global.before;

describe("Notes", () => {
  const mockServer = new MockServer();

  beforeAll( async () => {
    mockServer.start();

    // TODO: Need better solution. Does it conflict with other tests?
    cds.env.add({
      requires: {
        API_BUSINESS_PARTNER: {
          kind: "odata",
          model: "srv/external/API_BUSINESS_PARTNER",
          credentials: {
            url: mockServer.url()
          },
        },
      },
    });

  });

  const { expect, GET, PATCH } = require(".").run(
    "serve",
    "--project",
    "notes",
    "--with-mocks",
    "--in-memory"
  );


  it("get notes", async () => {
    const { status, data } = await GET("/notes/Notes");

    expect({ status, data }).to.containSubset({
      status: 200,
      data: {
        "@odata.context": "$metadata#Notes",
        value: [
          {
            ID: "24B58115-E394-423B-BEAB-53419A32B927",
            note: "note3",
            supplier_ID: "9980000082",
          },
          {
            ID: "545A3CF9-84CF-46C8-93DC-E29F0F2BC6BE",
            note: "note2 for 11",
            supplier_ID: "11",
          },
          {
            ID: "D632D4EE-E772-454A-913E-26A7B8DAA7FB",
            note: "note1 for 11",
            supplier_ID: "11",
          },
        ],
      },
    });
  });

  it("get remote suppliers", async () => {
    const { status, data } = await GET("/notes/Suppliers");

    expect({ status, data }).to.containSubset({
      status: 200,
      data: envelope("Suppliers", Suppliers)
    });
  });

  it("get remote suppliers with notes", async () => {
    const { status, data } = await GET("/notes/Suppliers?$expand=notes");

    expect({ status, data }).to.containSubset({
      status: 200,
      data: envelope('Suppliers(notes())', SuppliersExpandNotes),
    });
  });

  it("get notes via navigation", async () => {
    const { status, data } = await GET("/notes/Suppliers('11')/notes");

    expect({ status, data }).to.containSubset({
      status: 200,
      data: envelope('../$metadata#Notes', SuppliersExpandNotes[0].notes)
    });
  });

  it("get notes with suppliers", async () => {
    const { status, data } = await GET("/notes/Notes?$expand=supplier");

    expect({ status, data }).to.containSubset({
      status: 200,
      data: envelope('Notes(supplier())', NotesExpandSuppliers)
    });
  });

      // TODO: Seems not to respect filter for targetkeyFieldName
/*
  it.only("get supplier via navigation", async () => {
    const { status, data } = await GET("/notes/Notes(545A3CF9-84CF-46C8-93DC-E29F0F2BC6BE)/supplier");
    expect({ status, data }).to.containSubset({
      status: 200,
      data: envelope("Suppliers", NotesExpandSuppliers[0].supplier )
    });
  });
*/

  after(() => mockServer.close());
});
