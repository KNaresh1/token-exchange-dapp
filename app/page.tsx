"use client";

import { Box, Flex, Stack } from "@chakra-ui/react";
import { Header, Markets, NavBar } from "./components";
import useLoadContract from "./connect";

export default function Home() {
  useLoadContract();

  return (
    <Flex height="100vh">
      <Stack width={380} bg="secondary" p={5}>
        <Header />
        <Markets />
      </Stack>
      <Box flex="1" bg="primary" p={5}>
        <NavBar />
      </Box>
    </Flex>
  );
}
