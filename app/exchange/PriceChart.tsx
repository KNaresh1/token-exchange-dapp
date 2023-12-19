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
    <Box py={2} px={5} mt={8} bg="secondary" height="22em">
      {account && chartData && symbols.length > 0 ? (
        <Stack>
          <Flex direction="row">
            <Text fontSize="sm" fontWeight="semibold">
              {`${symbols[0]} / ${symbols[1]}`}
            </Text>
            {chartData.lastPriceChange === "up" ? (
              <Image
                src={upArrowLogo}
                alt="Up Arrow Logo"
                style={{ width: "55px", height: "22px" }}
              />
            ) : (
              <Image
                src={downArrowLogo}
                alt="Down Arrow Logo"
                style={{ width: "50px", height: "20px" }}
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
            height="300"
          />
        </Stack>
      ) : (
        <Banner text={"Please connect to Wallet"} />
      )}
    </Box>
  );
};

export default PriceChart;
