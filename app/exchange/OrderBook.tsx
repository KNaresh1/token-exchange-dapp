import { Box, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useContractStore from "../store";
import { buildOrderInfo } from "../utils";
import OrderTable from "./OrderTable";

const OrderBook = () => {
  const [symbols, tokens, openOrders] = useContractStore((s) => [
    s.symbols,
    s.tokens,
    s.openOrders,
  ]);

  const [buyOrders, setBuyOrders] = useState<null | any[]>(null);
  const [sellOrders, setSellOrders] = useState<null | any[]>(null);

  useEffect(() => {
    fetchSellOrders();
    fetchBuyOrders();
  }, [tokens, openOrders, symbols]);

  const fetchSellOrders = () => {
    const sell = openOrders
      ?.filter((order) => order.tokenGive === tokens[1].address)
      ?.map((order) =>
        buildOrderInfo(
          order.id,
          order.amountGive,
          order.amountGet,
          order.timestamp
        )
      );
    setSellOrders(sell);
  };

  const fetchBuyOrders = () => {
    const buy = openOrders
      ?.filter((order) => order.tokenGive === tokens[0].address)
      ?.map((order) =>
        buildOrderInfo(
          order.id,
          order.amountGet,
          order.amountGive,
          order.timestamp
        )
      );
    setBuyOrders(buy);
  };

  return (
    <Box py={2} px={5} bg="secondary" mt={5}>
      <Text fontSize="sm" fontWeight="semibold">
        Order Book
      </Text>
      <HStack mt={3} gap={20} align="flex-start" mb={5}>
        <Box width="50%">
          <OrderTable
            orderType={"Sell"}
            tokenGetSymbol={symbols[0]}
            tokenGiveSymbol={symbols[1]}
            orderBookInfo={sellOrders}
          />
        </Box>
        <Box width="50%">
          <OrderTable
            orderType={"Buy"}
            tokenGetSymbol={symbols[0]}
            tokenGiveSymbol={symbols[1]}
            orderBookInfo={buyOrders}
          />
        </Box>
      </HStack>
    </Box>
  );
};

export default OrderBook;
