import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Settings() {
  const navigate = useNavigate();

  // Load saved settings from localStorage (MVP)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notifyMethod, setNotifyMethod] = useState("none");
  const [frequency, setFrequency] = useState("daily");

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setNotifyMethod(data.notifyMethod || "none");
      setFrequency(data.frequency || "daily");
    }
  }, []);

  function saveSettings() {
    const data = {
      name,
      email,
      phone,
      notifyMethod,
      frequency,
    };
    localStorage.setItem("userSettings", JSON.stringify(data));
    navigate("/dashboard");
  }

  const needsPhone =
    (notifyMethod === "whatsapp" || notifyMethod === "both") &&
    phone.trim() === "";

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
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        mb={12}
      >
        <Heading
          fontWeight="600"
          fontSize="2xl"
          cursor="pointer"
          onClick={() => navigate("/dashboard")}
        >
          SheepAI
        </Heading>

        <Button
          variant="ghost"
          fontSize="sm"
          color="gray.600"
          _hover={{ color: "black" }}
          onClick={() => navigate("/dashboard")}
        >
          Back
        </Button>
      </Flex>

      <Heading fontSize="3xl" mb={3}>
        Settings
      </Heading>

      <Text color="gray.600" mb={12}>
        Manage your notifications, profile, and preferences.
      </Text>

      <VStack spacing={6} w="100%" maxW="500px">
        {/* NAME */}
        <Box w="100%">
          <Text mb={2} fontWeight="500">
            Name
          </Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            border="2px solid #E5E5E5"
            borderRadius="lg"
            p={6}
          />
        </Box>

        {/* EMAIL */}
        <Box w="100%">
          <Text mb={2} fontWeight="500">
            Email
          </Text>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            border="2px solid #E5E5E5"
            borderRadius="lg"
            p={6}
          />
        </Box>

        {/* PHONE */}
        <Box w="100%">
          <Text mb={2} fontWeight="500">
            Phone Number (for WhatsApp)
          </Text>
          <Input
            placeholder="+385..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            border="2px solid #E5E5E5"
            borderRadius="lg"
            p={6}
          />
        </Box>
        
        {/* SAVE */}
        <Button
          bg="black"
          color="white"
          px={10}
          py={6}
          borderRadius="lg"
          fontSize="md"
          _hover={{ bg: "gray.800" }}
          onClick={saveSettings}
          w="100%"
          mt={6}
        >
          Save Changes
        </Button>
      </VStack>
    </Flex>
  );
}