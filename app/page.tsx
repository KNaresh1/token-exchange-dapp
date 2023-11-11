import NavBar from "@/contracts/NavBar";
import { Box, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box textAlign="center" p={8}>
      <NavBar account="Test" />

      <Heading as="h6" size="lg" mt={10}>
        NextJS Hardhat Template
      </Heading>
    </Box>
  );
}
