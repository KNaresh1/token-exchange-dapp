import { Flex, Text } from "@chakra-ui/react";

const MyOrders = () => {
  return (
    <Flex py={2} px={5} bg="secondary" mt={5} height="10em">
      <Text fontSize="sm" fontWeight="semibold">
        My Orders
      </Text>
    </Flex>
  );
};

export default MyOrders;
