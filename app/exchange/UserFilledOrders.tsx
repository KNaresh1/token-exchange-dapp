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
import {
  OrderBookInfo,
  buildOrderInfo,
  filterBySelectedTokens,
} from "../utils";

const UserFilledOrders = () => {
  const { account } = useWeb3React();

  const [userFilledOrders, setUserFilledOrders] = useState<
    null | OrderBookInfo[]
  >(null);

  const [symbols, tokens, filledOrders] = useContractStore((s) => [
    s.symbols,
    s.tokens,
    s.filledOrders,
  ]);

  useEffect(() => {
    fetchUserFilledOrders();
  }, [filledOrders, tokens]);

  const fetchUserFilledOrders = () => {
    const _userFilledOrders = filterBySelectedTokens(filledOrders, tokens)
      .filter((order) => order.user === account || order.creator === account)
      .map((order) =>
        buildOrderInfo(
          order.id,
          order.tokenGet,
          order.amountGet,
          order.tokenGive,
          order.amountGive,
          order.timestamp,
          order.creator
        )
      );
    setUserFilledOrders(_userFilledOrders);
  };

  return (
    <Box
      display="flex"
      height="10em"
      alignItems="center"
      justifyContent="center"
    >
      {symbols.length > 0 && userFilledOrders ? (
        <Box width="100%" height="80%">
          <TableContainer>
            <Table size="sm" ml={-4} variant="unstyled">
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
                      {symbols[0]}/{symbols[1]}
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
                {userFilledOrders
                  ?.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                  .map((order, index) => {
                    const isBuy = order.creator === tokens[1].address;
                    return (
                      <Tr key={index} maxHeight="0px">
                        <Td py={1} fontSize="12px" fontWeight="semibold">
                          {order.formattedTimestamp}
                        </Td>
                        <Td
                          py={1}
                          fontSize="12px"
                          fontWeight="semibold"
                          textAlign="right"
                          color={isBuy ? "green" : "red"}
                        >
                          {isBuy ? "+" : "-"}
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
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Banner text={"No Filled Orders"} />
      )}
    </Box>
  );
};

export default UserFilledOrders;
