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
import {
  OrderBookInfo,
  buildOrderInfo,
  filterBySelectedTokens,
} from "../utils";

const Trades = () => {
  const [tokens, symbols, filledOrders] = useContractStore((s) => [
    s.tokens,
    s.symbols,
    s.filledOrders,
  ]);

  const [trades, setTrades] = useState<null | OrderBookInfo[]>(null);

  useEffect(() => {
    fetchTrades();
  }, [filledOrders, tokens]);

  const fetchTrades = () => {
    const _trades = filterBySelectedTokens(filledOrders, tokens)?.map((order) =>
      buildOrderInfo(
        order.id,
        order.tokenGet,
        order.amountGet,
        order.tokenGive,
        order.amountGive,
        order.timestamp
      )
    );
    setTrades(_trades);
  };

  return (
    <Box
      py={2}
      px={5}
      bg="secondary"
      mt={5}
      width="50%"
      height="13.6em"
      overflowY="auto"
    >
      <Text fontSize="sm" fontWeight="semibold">
        Trades
      </Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="80%"
      >
        {trades && symbols.length > 0 ? (
          <Box width="100%" height="100%">
            <TableContainer>
              <Table size="sm" mt={5} ml={-4} variant="unstyled">
                <Thead color="gray">
                  <Tr>
                    <Th fontWeight="semibold">
                      <Flex>
                        Time
                        <Image
                          src={sortLogo}
                          alt="Sort Logo"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </Flex>
                    </Th>
                    <Th fontWeight="semibold">
                      <Flex justifyContent="flex-end">
                        {symbols[0]}
                        <Image
                          src={sortLogo}
                          alt="Sort Logo"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </Flex>
                    </Th>
                    <Th fontWeight="semibold">
                      <Flex justifyContent="flex-end">
                        {`${symbols[0]}/${symbols[1]}`}
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
          </Box>
        ) : (
          <Banner text={"No Trades"} />
        )}
      </Box>
    </Box>
  );
};

export default Trades;
