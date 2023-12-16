import {
  Box,
  Button,
  HStack,
  Spacer,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Deposit from "./Deposit";

const Balance = () => {
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {}, []);

  return (
    <Box>
      <HStack>
        <Text fontSize="sm" fontWeight="semibold">
          Balance
        </Text>
        <Spacer />
        <Button
          size="xs"
          colorScheme={activeTab === 1 ? "blue" : ""}
          onClick={() => setActiveTab(1)}
        >
          Deposit
        </Button>
        <Button
          size="xs"
          colorScheme={activeTab === 2 ? "blue" : ""}
          onClick={() => setActiveTab(2)}
        >
          Withdraw
        </Button>
      </HStack>
      <Tabs>
        <TabPanels>
          <TabPanel pl={0}>
            {activeTab === 1 && <Deposit />}
            {activeTab === 2 && <p>Withdraw</p>}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Balance;
