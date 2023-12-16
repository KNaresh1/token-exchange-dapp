import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronRight } from "react-icons/fa";
import ethLogo from "../../public/eth.png";
import dappLogo from "../../public/logo.png";
import useContractStore from "../store";
import { transactTokens } from "../utils";

interface TransactTokenProps {
  token: any;
  symbol: string;
  tokenBalance: string;
  exchangeBalance: string;
  transactionType: string;
}

const TransactToken = ({
  token,
  symbol,
  tokenBalance,
  exchangeBalance,
  transactionType,
}: TransactTokenProps) => {
  const { provider } = useWeb3React();

  const [amount, setAmount] = useState<number>(0);

  const [exchange, setTransactionStatus] = useContractStore((s) => [
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

  const transactionHandler = handleSubmit(async () => {
    await transactTokens(
      provider,
      token,
      exchange,
      amount,
      transactionType,
      setTransactionStatus
    );
    setAmount(0);
  });

  return (
    <Box mt={1}>
      <HStack
        spacing="5em"
        align="flex-start"
        justifyContent="flex-start"
        height="3.8em"
      >
        <Stack>
          <Text fontSize="xs" color="neutral" mb={-1}>
            Token
          </Text>
          {symbol && (
            <Flex gap={1} align="center">
              <Image
                src={symbol === "DAPP" ? dappLogo : ethLogo}
                alt="Logo"
                style={{
                  width: symbol === "DAPP" ? "10px" : "20px",
                  height: symbol === "DAPP" ? "10px" : "20px",
                }}
              />
              <Text fontSize="sm">{symbol}</Text>
            </Flex>
          )}
        </Stack>
        <Stack>
          <Text fontSize="xs" color="neutral" mb={-1}>
            Wallet
          </Text>
          <Text fontSize="sm">{tokenBalance}</Text>
        </Stack>
        <Stack>
          <Text fontSize="xs" color="neutral" mb={-1}>
            Exchange
          </Text>
          <Text fontSize="sm">{exchangeBalance}</Text>
        </Stack>
      </HStack>
      <Box>
        <form onSubmit={transactionHandler}>
          <FormControl>
            <Text fontSize="sm" mb={1}>
              {symbol} Amount
            </Text>
          </FormControl>
          <FormControl>
            <NumberInput size="sm" value={amount === 0 ? "" : amount}>
              <NumberInputField
                rounded={8}
                border="0px"
                bg="primary"
                placeholder="0.0000"
                onChange={(e) => amountHandler(Number(e.target.value))}
              />
            </NumberInput>
          </FormControl>
          <Button
            mt={4}
            mb={2}
            size="sm"
            width="100%"
            variant="outline"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText={`${transactionType}ing`}
            rightIcon={<FaChevronRight />}
            isDisabled={amount <= 0}
            type="submit"
          >
            {transactionType}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default TransactToken;
