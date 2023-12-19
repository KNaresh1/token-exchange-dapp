import { Flex, Text } from "@chakra-ui/react";

const Banner = ({ text }: { text: string }) => {
  return (
    <Flex align="center" justify="center">
      <Text fontSize="sm" fontWeight="semibold">
        {text}
      </Text>
    </Flex>
  );
};

export default Banner;
