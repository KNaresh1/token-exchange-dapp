import { Box, Text } from "@chakra-ui/react";
import useContractStore from "../store";

const Token = () => {
  const dapp = useContractStore((s) => s.dapp);

  return (
    <Box mt={8}>
      <Text size="sm">DAPP address : {dapp.address}</Text>
    </Box>
  );
};

export default Token;
