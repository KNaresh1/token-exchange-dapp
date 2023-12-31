import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import downArrowLogo from "../../public/down-arrow.png";
import upArrowLogo from "../../public/up-arrow.png";
import { Banner } from "../components";
import useContractStore from "../store";
import { buildSeries, filterBySelectedTokens, options } from "../utils";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const PriceChart = () => {
  const { account } = useWeb3React();

  const [tokens, symbols, filledOrders] = useContractStore((s) => [
    s.tokens,
    s.symbols,
    s.filledOrders,
  ]);

  const [chartData, setChartData] = useState<null | any>(null);

  useEffect(() => {
    setChartData(buildSeries(filterBySelectedTokens(filledOrders, tokens)));
  }, [filledOrders, tokens]);

  return (
    <Box
      py={2}
      px={5}
      mt={6}
      bg="secondary"
      height="42%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {account && chartData && symbols.length > 0 ? (
        <Stack mt={2} width="100%">
          <Flex direction="row" alignItems="center">
            <Text fontSize="sm" fontWeight="semibold">
              {`${symbols[0]} / ${symbols[1]}`}
            </Text>
            {chartData.lastPriceChange === "up" ? (
              <Image
                src={upArrowLogo}
                alt="Up Arrow Logo"
                style={{ width: "60px", height: "30px" }}
              />
            ) : (
              <Image
                src={downArrowLogo}
                alt="Down Arrow Logo"
                style={{ width: "60px", height: "30px" }}
              />
            )}
            <Text fontSize="sm" fontWeight="semibold">
              {chartData.lastPrice}
            </Text>
          </Flex>
          <Chart
            type="candlestick"
            options={options}
            series={chartData.series}
            width="100%"
            height="320"
          />
        </Stack>
      ) : (
        <Banner text={"Please connect to Wallet"} />
      )}
    </Box>
  );
};

export default PriceChart;
