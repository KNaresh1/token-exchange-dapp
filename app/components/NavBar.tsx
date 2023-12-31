"use client";

import { Button, Flex, Link, Select, Spacer, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import Blockies from "react-blockies";
import ethLogo from "../../public/eth.png";
import config from "../config";
import useContractStore, { resetStore } from "../store";
import { shortenAccount } from "../utils";

const NavBar = () => {
  const { connector, chainId, account, isActive, isActivating } =
    useWeb3React();

  const [balance] = useContractStore((s) => [s.balance]);

  const [selectedChainId, setSelectedChainId] = useState<null | string>(null);
  const [selectedAccount, setSelectedAccount] = useState<undefined | string>();

  useEffect(() => {
    setSelectedAccount(account);
    if (selectedChainId) {
      connect(selectedChainId);
    }
  }, [chainId, account, selectedChainId]);

  const connect = async (chainId?: string) => {
    const chainToConnect = Number(chainId || selectedChainId);
    try {
      await connector.activate({ chainId: chainToConnect });
    } catch (error) {
      console.error(`Error while connecting to wallet. ${error}`);
    }
  };

  const handleChainChange = async (selected: string) => {
    setSelectedChainId(selected);
    if (isActive) {
      setSelectedAccount(undefined);
      resetStore();
    }
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
          width={152}
          size="sm"
          borderColor="transparent"
          focusBorderColor="transparent"
          iconColor="white"
          fontWeight="semibold"
          value={selectedChainId || "0"}
          onChange={(e) => handleChainChange(e.target.value)}
        >
          <option value="0" disabled>
            Select Network
          </option>
          <option value="0x7A69">Localhost</option>
          <option value="0xaa36a7">Sepolia</option>
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
      {chainId && selectedAccount ? (
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
            href={`${config.chains[chainId].explorerURL}/address/${selectedAccount}`}
            target="_blank"
            rel="noreferrer"
          >
            <Text fontSize="sm">{shortenAccount(selectedAccount)}</Text>
          </Link>
          <Blockies seed={selectedAccount} size={7} />
        </Flex>
      ) : (
        <Button
          px={8}
          py={4}
          colorScheme="blue"
          variant="outline"
          size="sm"
          ml={2}
          isDisabled={!selectedChainId}
          isLoading={isActivating}
          loadingText={"Connecting"}
          onClick={() => connect()}
        >
          Connect
        </Button>
      )}
    </Flex>
  );
};

export default NavBar;
