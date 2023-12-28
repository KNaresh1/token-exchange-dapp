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
import { useState } from "react";
import UserFilledOrders from "./UserFilledOrders";
import UserOpenOrders from "./UserOpenOrders";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<string>("Orders");

  return (
    <Box py={2} px={5} bg="secondary" mt={5} width="50%" overflowY="auto">
      <HStack>
        <Text fontSize="sm" fontWeight="semibold">
          {activeTab === "Orders" ? "My Orders" : "My Transactions"}
        </Text>
        <Spacer />
        <Box bg="primary" rounded={6}>
          <Button
            p={3}
            size="xs"
            colorScheme={activeTab === "Orders" ? "blue" : ""}
            onClick={() => setActiveTab("Orders")}
          >
            Orders
          </Button>
          <Button
            p={3}
            size="xs"
            colorScheme={activeTab === "Trades" ? "blue" : ""}
            onClick={() => setActiveTab("Trades")}
          >
            Trades
          </Button>
        </Box>
      </HStack>
      <Tabs>
        <TabPanels>
          <TabPanel pl={0} pr={0} pt={0}>
            {activeTab === "Orders" && <UserOpenOrders />}
            {activeTab === "Trades" && <UserFilledOrders />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Transactions;
