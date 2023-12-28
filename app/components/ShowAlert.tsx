"use client";

import { Box, Text, createStandaloneToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useEffect } from "react";
import config from "../config";
import useContractStore from "../store";
import { shortenAccount } from "../utils";

const ShowAlert = () => {
  const { chainId } = useWeb3React();

  const [transactionStatus, events] = useContractStore((s) => [
    s.transactionStatus,
    s.events,
  ]);

  const { toast } = createStandaloneToast();

  const currentChainConfig = config.chains[chainId?.toString() || ""];

  useEffect(() => {
    if (transactionStatus?.status !== "INITIAL") {
      addToast();
    }
  }, [transactionStatus]);

  const addToast = () => {
    const { status, transactionType } = transactionStatus;
    const message =
      status === "SUCCESS"
        ? "Transaction Successful"
        : status === "ERROR"
        ? "Transaction Failed"
        : "Transaction Pending";

    toast({
      title: message,
      description: (
        <Box>
          {status === "SUCCESS" ? (
            <Link
              href={`${currentChainConfig.explorerURL}/tx/${events[0].transactionHash}`}
              target="_blank"
              rel="noreferrer"
            >
              <Text fontSize="sm" color="teal.500">
                {shortenAccount(events[0].transactionHash)}
              </Text>
            </Link>
          ) : (
            ""
          )}
        </Box>
      ),
      status: status === "ERROR" ? "error" : "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return <></>;
};

export default ShowAlert;
