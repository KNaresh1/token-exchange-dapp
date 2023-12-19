import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import sortLogo from "../../public/sort.png";
import { Banner } from "../components";
import useContractStore from "../store";
import { OrderBookInfo, buildOrderInfo } from "../utils";

const Trades = () => {
  const [symbols, filledOrders] = useContractStore((s) => [
    s.symbols,
    s.filledOrders,
  ]);

  const [trades, setTrades] = useState<null | OrderBookInfo[]>(null);

  useEffect(() => {
    fetchTrades();
  }, [filledOrders]);

  const fetchTrades = () => {
    const _trades = filledOrders?.map((order) =>
      buildOrderInfo(
        order.id,
        order.amountGet,
        order.amountGive,
        order.timestamp
      )
    );
    setTrades(_trades);
  };

  return (
    <Box py={2} px={5} bg="secondary" mt={5} height="10em" overflowY="auto">
      <Text fontSize="sm" fontWeight="semibold">
        Trades
      </Text>
      {trades && symbols.length > 0 ? (
        <TableContainer>
          <Table size="sm" mt={2} ml={-4} variant="unstyled">
            <Thead color="gray">
              <Tr>
                <Th>
                  <Flex>
                    Time
                    <Image
                      src={sortLogo}
                      alt="Sort Logo"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </Flex>
                </Th>
                <Th>
                  <Flex justifyContent="flex-end">
                    {symbols[0]}
                    <Image
                      src={sortLogo}
                      alt="Sort Logo"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </Flex>
                </Th>
                <Th>
                  <Flex justifyContent="flex-end">
                    {`${symbols[0]} / ${symbols[1]}`}
                    <Image
                      src={sortLogo}
                      alt="Sort Logo"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </Flex>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {trades
                ?.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                .map((trade, index) => {
                  const next = trades[index + 1] || trades[index];
                  const isPriceHigher = trade.price < next.price;
                  return (
                    <Tr key={index} maxHeight="0px">
                      <Td py={1} fontSize="12px" fontWeight="semibold">
                        {trade.formattedTimestamp}
                      </Td>
                      <Td
                        py={1}
                        fontSize="12px"
                        fontWeight="semibold"
                        textAlign="right"
                        color={isPriceHigher ? "red" : "green"}
                      >
                        {trade.amountGive}
                      </Td>
                      <Td
                        py={1}
                        fontSize="12px"
                        fontWeight="semibold"
                        textAlign="right"
                      >
                        {trade.price}
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Banner text={"No Transactions"} />
      )}
    </Box>
  );
};

export default Trades;
