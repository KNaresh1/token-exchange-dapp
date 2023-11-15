"use client";

import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { NavBar } from "./components";
import { useConnectWallet, useLoadContract } from "./hooks";

export default function Home() {
  const { account, loading: walletLoading } = useConnectWallet();
  const { token, loading: contractLoading } = useLoadContract();

  return (
    <Box textAlign="center" py={8} width="80%">
      <NavBar account={account} />

      <Heading as="h6" size="lg" m={8}>
        NextJS Hardhat Template
      </Heading>

      {walletLoading || contractLoading ? (
        <Spinner
          thickness="5px"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      ) : (
        <Box mt={8}>
          <Text size="sm">Welcome!!</Text>
        </Box>
      )}
    </Box>
  );
}
