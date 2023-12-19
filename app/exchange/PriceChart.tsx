import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import downArrowLogo from "../../public/down-arrow.png";
import upArrowLogo from "../../public/up-arrow.png";
import { Banner } from "../components";
import useContractStore from "../store";
import { buildSeries, options } from "../utils";

const PriceChart = () => {
  const { account } = useWeb3React();

  const [symbols, filledOrders] = useContractStore((s) => [
    s.symbols,
    s.filledOrders,
  ]);

  const [chartData, setChartData] = useState<null | any>(null);

  useEffect(() => {
    setChartData(buildSeries(filledOrders));
  }, [filledOrders]);

  return (
    <Box py={2} px={5} mt={6} bg="secondary" height="24em" alignItems="center">
      {account && chartData && symbols.length > 0 ? (
        <Stack mt={2}>
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
