import { Flex, Spacer, Text } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../public/logo.png";

const NavBar = ({ account }: { account: string | undefined }) => {
  return (
    <Flex align="center" gap="2">
      <Image src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
      <Text fontSize="lg">DApp Template</Text>
      <Spacer />
      {account && <Text fontSize="md">{account}</Text>}
    </Flex>
  );
};

export default NavBar;
