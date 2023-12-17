import {
  Box,
  Button,
  FormControl,
  HStack,
  NumberInput,
  NumberInputField,
  Spacer,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronRight } from "react-icons/fa";
import useContractStore from "../store";
import { makeOrder } from "../utils";

const Order = () => {
  const { provider } = useWeb3React();

  const [orderType, setOrderType] = useState<string>("Buy");

  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const [tokens, exchange, setTransactionStatus] = useContractStore((s) => [
    s.tokens,
    s.exchange,
    s.setTransactionStatus,
  ]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const amountHandler = (value: number) => {
    setAmount(value);
  };

  const priceHandler = (value: number) => {
    setPrice(value);
  };

  const orderHandler = handleSubmit(async () => {
    await makeOrder(
      provider,
      tokens,
      exchange,
      { amount, price },
      orderType,
      setTransactionStatus
    );

    setAmount(0);
    setPrice(0);
  });

  return (
    <Box>
      <HStack>
        <Text fontSize="sm" fontWeight="semibold">
          New Order
        </Text>
        <Spacer />
        <Box bg="primary" rounded={6}>
          <Button
            px={5}
            py={3}
            size="xs"
            colorScheme={orderType === "Buy" ? "blue" : ""}
            onClick={() => setOrderType("Buy")}
          >
            Buy
          </Button>
          <Button
            px={5}
            py={3}
            size="xs"
            colorScheme={orderType === "Sell" ? "blue" : ""}
            onClick={() => setOrderType("Sell")}
          >
            Sell
          </Button>
        </Box>
      </HStack>
      <Tabs>
        <TabPanels>
          <TabPanel pl={0}>
            <Box>
              <form onSubmit={orderHandler}>
                <FormControl>
                  <Text fontSize="sm" mt={2} mb={1}>
                    {orderType} Amount
                  </Text>
                </FormControl>
                <FormControl>
                  <NumberInput size="sm" value={amount === 0 ? "" : amount}>
                    <NumberInputField
                      rounded={6}
                      border="0px"
                      bg="primary"
                      placeholder="0.0000"
                      onChange={(e) => amountHandler(Number(e.target.value))}
                    />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <Text fontSize="sm" mt={5} mb={1}>
                    {orderType} Price
                  </Text>
                </FormControl>
                <FormControl>
                  <NumberInput size="sm" value={price === 0 ? "" : price}>
                    <NumberInputField
                      rounded={6}
                      border="0px"
                      bg="primary"
                      placeholder="0.0000"
                      onChange={(e) => priceHandler(Number(e.target.value))}
                    />
                  </NumberInput>
                </FormControl>
                <Button
                  mt={6}
                  size="sm"
                  width="100%"
                  variant="outline"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText={"Ordering"}
                  rightIcon={<FaChevronRight />}
                  isDisabled={amount <= 0 || price <= 0}
                  type="submit"
                >
                  {orderType} Order
                </Button>
              </form>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Order;
