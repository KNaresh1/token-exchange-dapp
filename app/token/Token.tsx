import { Box, Text } from "@chakra-ui/react";
import useContractStore from "../store";

const Token = () => {
  const token = useContractStore((s) => s.token);

  return (
    <Box mt={8}>
      <Text size="sm">Token address : {token.address}</Text>
    </Box>
  );
};

export default Token;
