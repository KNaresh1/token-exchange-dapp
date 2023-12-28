import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import sortLogo from "../../public/sort.png";
import { Banner } from "../components";
import useContractStore from "../store";
import {
  OrderBookInfo,
  buildOrderInfo,
  cancelOrder,
  filterBySelectedTokens,
} from "../utils";

const UserOpenOrders = () => {
  const { provider, account } = useWeb3React();

  const [userOpenOrders, setUserOpenOrders] = useState<null | OrderBookInfo[]>(
    null
  );

  const [symbols, tokens, exchange, openOrders, setTransactionStatus] =
    useContractStore((s) => [
      s.symbols,
      s.tokens,
      s.exchange,
      s.openOrders,
      s.setTransactionStatus,
    ]);

  useEffect(() => {
    fetchUserOpenOrders();
  }, [openOrders, tokens]);

  const fetchUserOpenOrders = () => {
    const _userOpenOrders = filterBySelectedTokens(openOrders, tokens)
      .filter((order) => order.user === account)
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
    setUserOpenOrders(_userOpenOrders);
  };

  const cancelOrderHandler = async (order: OrderBookInfo) => {
    await cancelOrder(provider, exchange, order, setTransactionStatus);
  };

  return (
    <Box
      display="flex"
      height="10em"
      alignItems="center"
      justifyContent="center"
    >
      {symbols.length > 0 && userOpenOrders ? (
        <Box width="100%" height="80%">
          <TableContainer>
            <Table size="sm" ml={-4} variant="unstyled">
              <Thead color="gray">
                <Tr>
                  <Th fontWeight="semibold">
                    <Flex>
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
                      {symbols[0]}/{symbols[1]}
                      <Image
                        src={sortLogo}
                        alt="Sort Logo"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </Flex>
                  </Th>
                  <Th fontWeight="semibold">
                    <Flex justifyContent="flex-end">Button</Flex>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {userOpenOrders
                  ?.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                  .map((order, index) => {
                    return (
                      <Tr key={index} maxHeight="0px">
                        <Td
                          py={1}
                          fontSize="12px"
                          fontWeight="semibold"
                          color={
                            order.tokenGet === tokens[1].address
                              ? "green"
                              : "red"
                          }
                        >
                          {order.amountGive}
                        </Td>
                        <Td
                          py={1}
                          fontSize="12px"
                          fontWeight="semibold"
                          textAlign="right"
                        >
                          {order.price}
                        </Td>
                        <Td
                          py={1}
                          fontSize="12px"
                          fontWeight="semibold"
                          textAlign="right"
                        >
                          <Button
                            size="xs"
                            height={5}
                            px={2}
                            variant="outline"
                            colorScheme="blue"
                            rounded={4}
                            onClick={() => cancelOrderHandler(order)}
                          >
                            Cancel
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Banner text={"No Open Orders"} />
      )}
    </Box>
  );
};

export default UserOpenOrders;
