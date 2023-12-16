"use client";

import { Button, Flex, Link, Select, Spacer, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import Blockies from "react-blockies";
import ethLogo from "../../public/eth.png";
import config from "../config";
import { useConnectWallet } from "../connect";
import useContractStore from "../store";
import { shortenAccount } from "../utils";

const supportedNetworks = [
  { value: 31337, label: "Localhost" },
  { value: 11155111, label: "Sepolia" },
];

const NavBar = () => {
  const [balance] = useContractStore((s) => [s.balance]);

  const [selectedChainId, setSelectedChainId] = useState<number>(31337);

  const {
    account,
    active: isActive,
    loading: isConnecting,
    connectWallet,
    deactivate,
  } = useConnectWallet(selectedChainId);

  const handleChainChange = (newChainId: number) => {
    setSelectedChainId(newChainId);
    deactivate();
  };

  return (
    <Flex align="center" gap={1} height={8}>
      <Flex bg="secondary" alignItems="center">
        <Image
          src={ethLogo}
          alt="ETH Logo"
          style={{ width: "20px", height: "20px" }}
        />
        <Select
          p={0}
          border={0}
          width={120}
          size="sm"
          borderColor="transparent"
          focusBorderColor="transparent"
          iconColor="white"
          fontWeight="semibold"
          value={selectedChainId}
          onChange={(e) => handleChainChange(Number(e.target.value))}
        >
          {supportedNetworks.map((network, index) => (
            <option key={index} value={network.value}>
              {network.label}
            </option>
          ))}
        </Select>
      </Flex>

      <Spacer />
      <Flex
        px={3}
        py={3}
        gap={1}
        bg="secondary"
        borderRadius="8"
        flexDirection="row"
        alignItems="center"
      >
        <Text fontSize="sm" color="gray.500">
          My Balance:{" "}
        </Text>

        {Number(balance) > 0 ? (
          <Text fontSize="sm">{Number(balance).toFixed(4)}</Text>
        ) : (
          <Text fontSize="sm">0 ETH</Text>
        )}
      </Flex>
      {isActive && account ? (
        <Flex
          px={3}
          py={2}
          gap={3}
          bg="secondary"
          borderRadius="8"
          flexDirection="row"
          alignItems="center"
        >
          <Link
            href={`${config.chains[selectedChainId].explorerURL}/address/${account}`}
            target="_blank"
            rel="noreferrer"
          >
            <Text fontSize="sm">{shortenAccount(account)}</Text>
          </Link>
          <Blockies seed={account} size={7} />
        </Flex>
      ) : (
        <Button
          px={8}
          py={4}
          colorScheme="blue"
          variant="outline"
          size="sm"
          ml={2}
          isLoading={isConnecting}
          loadingText={"Connecting"}
          onClick={() => connectWallet()}
        >
          Connect
        </Button>
      )}
    </Flex>
  );
};

export default NavBar;
