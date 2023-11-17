"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import useLoadContract from "./hooks";

export default function Home() {
  const { token } = useLoadContract();

  return (
    <Box textAlign="center">
      <Heading as="h6" size="lg" m={8}>
        NextJS Hardhat Template
      </Heading>

      {token && (
        <Box mt={8}>
          <Text size="sm">Token address : {token.address}</Text>
        </Box>
      )}
    </Box>
  );
}
