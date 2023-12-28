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
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import sortLogo from "../../public/sort.png";
import { Banner } from "../components";
import useContractStore from "../store";
import { OrderBookInfo, fillOrder } from "../utils";

interface OrderTableProps {
  orderType: string;
  tokenGetSymbol: string;
  tokenGiveSymbol: string;
  orderBookInfo: null | OrderBookInfo[];
}

const OrderTable = ({
  orderType,
  tokenGetSymbol,
  tokenGiveSymbol,
  orderBookInfo,
}: OrderTableProps) => {
  const { provider } = useWeb3React();

  const [exchange, setTransactionStatus] = useContractStore((s) => [
    s.exchange,
    s.setTransactionStatus,
  ]);

  const fillUserOrder = async (order: OrderBookInfo) => {
    await fillOrder(provider, exchange, order, setTransactionStatus);
  };

  return (
    <Box
      height="9.6em"
      overflowY="auto"
      bg="secondary"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {orderBookInfo?.length !== 0 && tokenGetSymbol && tokenGiveSymbol ? (
        <Box width="100%" height="100%">
          <TableContainer>
            <Text fontSize="sm" mb={1}>
              {orderType}ing
            </Text>
            <Table size="sm" mt={2} ml={-4} variant="unstyled">
              <Thead color="gray">
                <Tr>
                  <Th fontWeight="semibold">
                    <Flex>
                      {tokenGetSymbol}
                      <Image
                        src={sortLogo}
                        alt="Sort Logo"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </Flex>
                  </Th>
                  <Th fontWeight="semibold">
                    <Flex justifyContent="flex-end">
                      {tokenGetSymbol}/{tokenGiveSymbol}
                      <Image
                        src={sortLogo}
                        alt="Sort Logo"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </Flex>
                  </Th>
                  <Th fontWeight="semibold">
                    <Flex justifyContent="flex-end">
                      {tokenGiveSymbol}
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
                {orderBookInfo
                  ?.sort((a, b) => b.price - a.price)
                  .map((order, index) => {
                    return (
                      <Tr
                        key={index}
                        maxHeight="0px"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => fillUserOrder(order)}
                      >
                        <Td py={1} fontSize="12px" fontWeight="semibold">
                          {order.amountGive}
                        </Td>
                        <Td
                          py={1}
                          fontSize="12px"
                          fontWeight="semibold"
                          textAlign="right"
                          color={orderType === "Buying" ? "green" : "red"}
                        >
                          {order.price}
                        </Td>
                        <Td
                          py={1}
                          textAlign="right"
                          fontWeight="semibold"
                          fontSize="12px"
                        >
                          {order.amountGet}
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Banner text={`No ${orderType} Orders`} />
      )}
    </Box>
  );
};

export default OrderTable;
