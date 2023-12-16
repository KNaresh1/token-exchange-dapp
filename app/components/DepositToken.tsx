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
import { depositTokens } from "../utils";

interface DepositTokenProps {
  token: any;
  symbol: string;
  tokenBalance: string;
  exchangeBalance: string;
}

const DepositToken = ({
  token,
  symbol,
  tokenBalance,
  exchangeBalance,
}: DepositTokenProps) => {
  const { provider } = useWeb3React();

  const [depositAmount, setDepositAmount] = useState<number>(0);

  const [exchange, setDepositStatus] = useContractStore((s) => [
    s.exchange,
    s.setDepositStatus,
  ]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const depositAmountHandler = (value: number) => {
    setDepositAmount(value);
  };

  const depositHandler = handleSubmit(async () => {
    depositTokens(provider, token, exchange, depositAmount, setDepositStatus);
    setDepositAmount(0);
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
                src={symbol === "mETH" ? ethLogo : dappLogo}
                alt="Logo"
                style={{
                  width: symbol === "mETH" ? "20px" : "10px",
                  height: symbol === "mETH" ? "20px" : "10px",
                }}
              />
              <Text fontSize="xs">{symbol}</Text>
            </Flex>
          )}
        </Stack>
        <Stack>
          <Text fontSize="xs" color="neutral" mb={-1}>
            Wallet
          </Text>
          <Text fontSize="xs">{tokenBalance}</Text>
        </Stack>
        <Stack>
          <Text fontSize="xs" color="neutral" mb={-1}>
            Exchange
          </Text>
          <Text fontSize="xs">{exchangeBalance}</Text>
        </Stack>
      </HStack>
      <Box>
        <form onSubmit={depositHandler}>
          <FormControl>
            <Text fontSize="sm" mb={1}>
              {symbol} Amount
            </Text>
          </FormControl>
          <FormControl>
            <NumberInput
              size="sm"
              value={depositAmount === 0 ? "" : depositAmount}
            >
              <NumberInputField
                rounded={8}
                border="0px"
                bg="primary"
                placeholder="0.0000"
                onChange={(e) => depositAmountHandler(Number(e.target.value))}
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
            loadingText="Depositing"
            rightIcon={<FaChevronRight />}
            isDisabled={depositAmount <= 0}
            type="submit"
          >
            Deposit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default DepositToken;
