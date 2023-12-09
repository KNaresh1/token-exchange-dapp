"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import useLoadContract from "./connect";

export default function Home() {
  const { account } = useWeb3React();
  useLoadContract();

  return (
    <Grid
      templateColumns="repeat(3, 1fr)" // Adjust the number and size of columns as needed
      gap={6} // Adjust the gap between grid items
    >
      <GridItem colSpan={3}>Item 1</GridItem>
      <GridItem>Item 2</GridItem>
      <GridItem>Item 3</GridItem>
      <GridItem>Item 4</GridItem>
      <GridItem colSpan={2}>Item 5 (span 2 columns)</GridItem>
    </Grid>
  );
}
