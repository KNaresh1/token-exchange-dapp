"use client";

import { Box, Divider, Flex, Stack } from "@chakra-ui/react";
import { Balance, Header, Markets, NavBar } from "./components";
import useLoadContract from "./connect";

export default function Home() {
  useLoadContract();

  return (
    <Flex height="100vh">
      <Stack width={380} bg="secondary" p={5}>
        <Header />
        <Markets />
        <Divider mt={4} mb={4} borderColor="gray.600" />
        <Balance />
      </Stack>
      <Box flex="1" bg="primary" p={5}>
        <NavBar />
      </Box>
    </Flex>
  );
}
