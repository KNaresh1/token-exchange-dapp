import {
  Box,
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
import { OrderBookInfo, buildOrderInfo } from "../utils";

const UserOpenOrders = () => {
  const { account } = useWeb3React();

  const [userOpenOrders, setUserOpenOrders] = useState<null | OrderBookInfo[]>(
    null
  );

  const [symbols, tokens, openOrders] = useContractStore((s) => [
    s.symbols,
    s.tokens,
    s.openOrders,
  ]);

  useEffect(() => {
    fetchUserOpenOrders();
  }, [openOrders]);

  const fetchUserOpenOrders = () => {
    const _userOpenOrders = openOrders
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

  return (
    <Box>
      {symbols.length > 0 && userOpenOrders ? (
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
                          order.tokenGet === tokens[1].address ? "green" : "red"
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
                      ></Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Banner text={"No Open Orders"} />
      )}
    </Box>
  );
};

export default UserOpenOrders;
