import { Box, Text } from "@chakra-ui/react";

const Banner = ({ text }: { text: string }) => {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="semibold">
        {text}
      </Text>
    </Box>
  );
};

export default Banner;
