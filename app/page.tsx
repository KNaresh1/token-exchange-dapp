"use client";

import { Box, Flex } from "@chakra-ui/react";
import { NavBar } from "./components";
import Header from "./components/Header";
import useLoadContract from "./connect";

export default function Home() {
  useLoadContract();

  return (
    <Flex height="100vh">
      <Box width={380} bg="secondary" p={5}>
        <Header />
      </Box>
      <Box flex="1" bg="primary" p={5}>
        <NavBar />
      </Box>
    </Flex>
  );
}
