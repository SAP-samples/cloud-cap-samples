import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, message, Divider, Tag, Collapse, Table, Spin } from "antd";
import moment from "moment";
import { useErrors } from "../../useErrors";
import { useGlobals } from "../../GlobalContext";
import { cancelInvoice, fetchInvoices } from "../../api-service";

const { Panel } = Collapse;
const MESSAGE_TIMEOUT = 2;
const INVOICE_STATUS = {
  2: {
    tagTitle: "Shipped",
    color: "green",
  },
  1: {
    tagTitle: "Submitted",
    color: "processing",
    canCancel: true,
  },
  ["-1"]: {
    tagTitle: "Cancelled",
    color: "default",
  },
};
const CANCELLED_STATUS = -1;
const DATE_TIME_FORMAT_PATTERN = "LLLL";
const UTC_DATE_TIME_FORMAT = "YYYY-MM-DDThh:mm:ss";
const INVOICE_ITEMS_COLUMNS = [
  {
    title: "Track name",
    dataIndex: "name",
  },
  {
    title: "Artist",
    dataIndex: "artistName",
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
const LEVERAGE_DURATION = 1; // in hours
const STATUSES = { submitted: 1, shipped: 2, canceled: -1 };

const isLeverageTimeExpired = (utcNowTimestamp, invoiceDate) => {
  const duration = moment.duration(
    moment(utcNowTimestamp).diff(moment(invoiceDate).valueOf())
  );
  return duration.asHours() > LEVERAGE_DURATION;
};

const chooseStatus = (utcNowTimestamp, invoiceDate, statusFromDb) => {
  if (
    isLeverageTimeExpired(utcNowTimestamp, invoiceDate) &&
    statusFromDb !== STATUSES.canceled
  ) {
    return INVOICE_STATUS[STATUSES.shipped];
  }
  return INVOICE_STATUS[statusFromDb];
};

const ExtraHeader = ({ ID, invoiceDate, status: initialStatus }) => {
  const { loading, setLoading } = useGlobals();
  const { handleError } = useErrors();
  const [loadingHeaderId, setLoadingHeaderId] = useState();
  const [status, setStatus] = useState(initialStatus);

  const statusConfig = useMemo(() => {
    const utcNowTimestamp = moment(
      moment().utc().format(UTC_DATE_TIME_FORMAT)
    ).valueOf();
    return chooseStatus(utcNowTimestamp, invoiceDate, status);
  }, [status]);

  const onCancelInvoice = (event, ID) => {
    event.stopPropagation();
    setLoading(true);
    setLoadingHeaderId(ID);
    cancelInvoice(ID)
      .then(() => {
        message.success("Invoice successfully cancelled", MESSAGE_TIMEOUT);
        setLoading(false);
        setLoadingHeaderId(undefined);
        setStatus(CANCELLED_STATUS);
      })
      .catch(handleError);
  };

  return (
    <Spin spinning={loading && loadingHeaderId === ID}>
      <Tag color={statusConfig.color}>{statusConfig.tagTitle}</Tag>
      {statusConfig.canCancel && (
        <Button
          onClick={(event) => onCancelInvoice(event, ID)}
          size="small"
          danger
        >
          Cancel
        </Button>
      )}
    </Spin>
  );
};

const MyInvoices = () => {
  const { handleError } = useErrors();
  const { setLoading } = useGlobals();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchInvoices()
      .then((response) => {
        const {
          data: { value },
        } = response;
        setInvoices(value);
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  const genExtra = useCallback(
    (ID, status, invoiceDate) => (
      <ExtraHeader ID={ID} status={status} invoiceDate={invoiceDate} />
    ),
    []
  );
  const invoiceElements = useMemo(() => {
    return invoices.map(({ ID, status, invoiceDate, total, invoiceItems }) => {
      const invoiceItemsData = invoiceItems.map(
        ({
          ID,
          track: {
            name,
            unitPrice,
            album: {
              title: albumTitle,
              artist: { name: artistName },
            },
          },
        }) => ({
          key: ID,
          ID,
          name,
          unitPrice,
          albumTitle,
          artistName,
        })
      );

      return (
        <Panel
          header={moment(invoiceDate).format(DATE_TIME_FORMAT_PATTERN)}
          key={ID}
          extra={genExtra(ID, status, invoiceDate)}
        >
          <div>
            <Table
              bordered={false}
              pagination={false}
              columns={INVOICE_ITEMS_COLUMNS}
              dataSource={invoiceItemsData}
              size="middle"
              footer={() => (
                <span
                  style={{ fontWeight: 600 }}
                >{`Total price: ${total}`}</span>
              )}
            />
          </div>
        </Panel>
      );
    });
  }, [invoices]);

  return (
    <div>
      {invoiceElements && (
        <>
          <Divider orientation="left">My invoices</Divider>
          <Collapse style={{ borderRadius: 6 }} expandIconPosition="left">
            {invoiceElements}
          </Collapse>
        </>
      )}
    </div>
  );
};

export { MyInvoices };
