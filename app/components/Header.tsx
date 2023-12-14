import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../public/logo.png";

const Header = () => {
  return (
    <Flex align="center" gap="2" py={2}>
      <Image src={logo} alt="Logo" style={{ width: "30px", height: "30px" }} />
      <Text fontSize="md" fontWeight="semibold">
        DApp Token Exchange
      </Text>
    </Flex>
  );
};

export default Header;
