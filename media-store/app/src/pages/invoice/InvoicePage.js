import React from "react";
import { Table, Button, message } from "antd";
import { useGlobals } from "../../GlobalContext";
import { useHistory } from "react-router-dom";
import { invoice } from "../../api-service";
import { useErrors } from "../../useErrors";
import "./InvoicePage.css";

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
const MESSAGE_TIMEOUT = 2;

const InvoicePage = () => {
  const history = useHistory();
  const { handleError } = useErrors();
  const { invoicedItems, setInvoicedItems, setLoading } = useGlobals();

  const data = invoicedItems.map(({ ID: key, ...otherProps }) => ({
    key,
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
        setLoading(false);
        setInvoicedItems([]);
        message.success("Invoice successfully completed", MESSAGE_TIMEOUT);
        history.push("/person");
      })
      .catch(handleError);
  };
  const onCancel = () => {
    setInvoicedItems([]);
    history.push("/");
  };

  return (
    <div style={{ borderRadius: 6, backgroundColor: "white", padding: 10 }}>
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
            <Button
              type="primary"
              size="large"
              style={{ borderRadius: 6 }}
              onClick={onBuy}
            >
              Buy
            </Button>
            <Button
              size="large"
              style={{ borderRadius: 6, marginLeft: 5 }}
              onClick={onCancel}
              danger
            >
              Cancel
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export { InvoicePage };
