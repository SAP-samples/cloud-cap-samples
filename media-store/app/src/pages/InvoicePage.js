import React from "react";
import { Table, Button, message } from "antd";
import { useAppState } from "../hooks/useAppState";
import { useHistory } from "react-router-dom";
import { invoice } from "../api/calls";
import { useErrors } from "../hooks/useErrors";
import { MESSAGE_TIMEOUT } from "../util/constants";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Artist",
    dataIndex: "artist",
  },
  {
    title: "Album",
    dataIndex: "albumTitle",
  },
  {
    title: "Price",
    dataIndex: "unitPrice",
  },
];

const InvoicePage = () => {
  const history = useHistory();
  const { handleError } = useErrors();
  const { user, invoicedItems, setInvoicedItems, setLoading } = useAppState();

  const data = invoicedItems.map(({ ID, ...otherProps }) => ({
    key: `invoiceItem${ID}`,
    ...otherProps,
  }));

  const onBuy = () => {
    setLoading(true);
    invoice(
      invoicedItems.map(({ ID, unitPrice }) => ({
        ID,
        unitPrice,
      }))
    )
      .then(() => {
        setInvoicedItems([]);
        message.success("Invoice successfully completed", MESSAGE_TIMEOUT);
        history.push("/invoices");
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  };
  const onCancel = () => {
    setInvoicedItems([]);
    history.push("/");
  };
  const goLogin = () => {
    history.push("/login");
  };

  return (
    <div style={{ backgroundColor: "white", padding: 10 }}>
      <Table
        bordered={false}
        pagination={false}
        columns={columns}
        dataSource={data}
        size="middle"
        footer={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: 5,
            }}
          >
            {user ? (
              <>
                <Button type="primary" size="large" onClick={onBuy}>
                  Buy
                </Button>
                <Button
                  size="large"
                  style={{ marginLeft: 5 }}
                  onClick={onCancel}
                  danger
                >
                  Cancel
                </Button>
              </>
            ) : (
              <section>
                <Button type="primary" size="large" onClick={goLogin}>
                  Login
                </Button>
                <span> to buy selected</span>
              </section>
            )}
          </div>
        )}
      />
    </div>
  );
};

export { InvoicePage };
