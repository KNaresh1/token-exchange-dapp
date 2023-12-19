import { get, groupBy, maxBy, minBy } from "lodash";
import moment from "moment";
import { OrderBookInfo } from "./types";
import { buildOrderInfo } from "./utils";

import { ApexOptions } from "apexcharts";

export const options: ApexOptions = {
  chart: {
    animations: { enabled: true },
    toolbar: { show: false },
    width: "100px",
  },
  tooltip: {
    enabled: true,
    theme: "",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    x: {
      show: false,
      format: "dd MMM",
      formatter: undefined,
    },
    y: {
      title: {},
    },
    marker: {
      show: false,
    },
    items: {
      display: "flex",
    },
    fixed: {
      enabled: false,
      position: "topRight",
      offsetX: 0,
      offsetY: 0,
    },
  },
  grid: {
    show: true,
    borderColor: "#767F92",
    strokeDashArray: 0,
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: "#25CE8F",
        downward: "#F45353",
      },
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      show: true,
      style: {
        colors: "#767F92",
        fontSize: "14px",
        cssClass: "apexcharts-xaxis-label",
      },
    },
  },
  yaxis: {
    labels: {
      show: true,
      minWidth: 0,
      maxWidth: 160,
      style: {
        colors: "#F1F2F9",
        fontSize: "14px",
        cssClass: "apexcharts-yaxis-label",
      },
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
    },
  },
};

export const buildSeries = (orders: any[]) => {
  orders = orders
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((order) =>
      buildOrderInfo(
        order.id,
        order.tokenGet,
        order.amountGet,
        order.tokenGive,
        order.amountGive,
        order.timestamp
      )
    );
  const lastPrice = get(orders[orders.length - 1], "price", 0);
  const secondLastPrice = get(orders[orders.length - 2], "price", 0);

  return {
    lastPrice,
    lastPriceChange: lastPrice >= secondLastPrice ? "up" : "down",
    series: [{ data: buildChartData(orders) }],
  };
};

export const buildChartData = (orders: OrderBookInfo[]) => {
  const orderGroup = groupBy(orders, (o) =>
    moment.unix(Number(o.timestamp)).startOf("hour").format()
  );

  const keys = Object.keys(orderGroup);

  const chartData = keys.map((key) => {
    const group: OrderBookInfo[] = orderGroup[key];

    const open = group[0];
    const high = maxBy(group, "price");
    const low = minBy(group, "price");
    const close = group[group.length - 1];

    return {
      x: new Date(key),
      y: [open.price, high?.price, low?.price, close.price],
    };
  });
  return chartData;
};
