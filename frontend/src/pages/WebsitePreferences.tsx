import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Select,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Logo } from "../components/Logo";

export default function WebsitePreferences() {
  const navigate = useNavigate();
  const location = useLocation();

  const website = location.state?.website;
  const categories = location.state?.categories;

  const [notifyMethod, setNotifyMethod] = useState("none");
  const [frequency, setFrequency] = useState("daily");

  const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
  const phone = userSettings.phone || "";

  const needsPhone =
    (notifyMethod === "whatsapp" || notifyMethod === "both") &&
    phone.trim() === "";

  function save() {
    const stored = JSON.parse(
      localStorage.getItem("websitePreferences") || "{}"
    );

    stored[website] = {
      categories,
      notifyMethod,
      frequency: notifyMethod === "none" ? null : frequency,
    };

    localStorage.setItem("websitePreferences", JSON.stringify(stored));

    navigate("/swipe", { state: { website, categories } });
  }

  return (
    <Flex
      bg="white"
      minH="100vh"
      direction="column"
      px={{ base: 6, md: 16 }}
      py={10}
      align="center"
    >
      {/* HEADER */}
      <Flex w="100%" justify="space-between" align="center" mb={12}>
        <Logo navigateTo="/dashboard" />

        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
      </Flex>

      <Heading fontSize="3xl" mb={4}>
        Notifications for {website}
      </Heading>
      <Text color="gray.600" mb={10} maxW="600px" textAlign="center">
        Choose how and how often you want updates for this source.
      </Text>

      <VStack spacing={6} w="100%" maxW="500px">
        {/* Delivery method */}
        <Box w="100%">
          <Text mb={2} fontWeight="500">
            Delivery Method
          </Text>
          <Select
            value={notifyMethod}
            onChange={(e) => setNotifyMethod(e.target.value)}
            border="2px solid #E5E5E5"
            borderRadius="lg"
            p={3}
          >
            <option value="none">None</option>
            <option value="email">Email only</option>
            <option value="whatsapp">WhatsApp only</option>
            <option value="both">Email + WhatsApp</option>
          </Select>
        </Box>

        {needsPhone && (
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            WhatsApp requires a phone number in your Settings.
          </Alert>
        )}

        {/* Frequency only if notifyMethod != none */}
        {notifyMethod !== "none" && (
          <Box w="100%">
            <Text mb={2} fontWeight="500">
              Frequency
            </Text>
            <Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              border="2px solid #E5E5E5"
              borderRadius="lg"
              p={3}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </Box>
        )}

        <Button
          bg="black"
          color="white"
          px={10}
          py={6}
          borderRadius="lg"
          w="100%"
          onClick={save}
          disabled={needsPhone}
        >
          Continue to Swipe
        </Button>
      </VStack>
    </Flex>
  );
}
