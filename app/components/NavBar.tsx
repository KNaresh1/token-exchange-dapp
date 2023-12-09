"use client";

import { Button, Flex, Spacer, Text } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useConnectWallet } from "../connect";
import { shortenAccount } from "../utils";

const NavBar = () => {
  const {
    account,
    active: isActive,
    loading: isConnecting,
    connectWallet,
  } = useConnectWallet();

  return (
    <Flex align="center" gap="2">
      <Image src={logo} alt="Logo" style={{ width: "30px", height: "30px" }} />
      <Text fontSize="sm">DApp Token Exchange</Text>

      <Spacer />

      {isActive && account ? (
        <Text fontSize="sm">{shortenAccount(account)}</Text>
      ) : (
        <Button
          colorScheme="blue"
          size="sm"
          isLoading={isConnecting}
          loadingText={"Connecting"}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};

export default NavBar;
