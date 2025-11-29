import {
  Flex,
  Heading,
  Text,
  Button,
  Select,
  VStack,
  Alert,
  AlertIcon,
  Box,
  Input,
  Spinner
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.id;

  const [loading, setLoading] = useState(true);

  const [types, setTypes] = useState([]);
  const [frequencies, setFrequencies] = useState([]);

  const [notificationType, setNotificationType] = useState("none");
  const [frequency, setFrequency] = useState("daily");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [typesRes, freqRes, prefRes] = await Promise.all([
          axios.get("http://localhost:4000/notifications/types"),
          axios.get("http://localhost:4000/notifications/frequencies"),
          axios.get(`http://localhost:4000/notifications/preferences/${userId}`)
        ]);

        setTypes(typesRes.data);
        setFrequencies(freqRes.data);

        if (prefRes.data) {
          setNotificationType(prefRes.data.notificationType);
          if (prefRes.data.notificationFrequency) {
            setFrequency(prefRes.data.notificationFrequency);
          }
        }

        if (storedUser?.phoneNumber) {
          setPhoneNumber(storedUser.phoneNumber);
        }
      } catch {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function save() {
    setSuccess("");
    setError("");

    // VALIDATE PHONE
    if (notificationType === "whatsapp" || notificationType === "both") {
      if (!phoneNumber.trim()) {
        setError("Phone number is required for WhatsApp notifications.");
        return;
      }

      const phoneRegex = /^\+?[0-9]{7,15}$/;

      if (!phoneRegex.test(phoneNumber)) {
        setError("Invalid phone number format. Use: +385912345678");
        return;
      }
    }

    try {
      // Save notification preferences
      await axios.put(
        `http://localhost:4000/notifications/preferences/${userId}`,
        {
          notificationType,
          notificationFrequency:
            notificationType === "none" ? null : frequency,
        }
      );

      // Save phone number
      await axios.put(
        `http://localhost:4000/auth/phone/${userId}`,
        { phoneNumber }
      );

      // Update localStorage
      const newUser = { ...storedUser, phoneNumber };
      localStorage.setItem("user", JSON.stringify(newUser));

      setSuccess("Settings updated!");
    } catch {
      setError("Failed to save changes.");
    }
  }

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" color="black" />
      </Flex>
    );
  }

  return (
    <Flex
      minH="100vh"
      bg="white"
      direction="column"
      px={{ base: 6, md: 16 }}
      py={10}
      align="center"
    >
      {/* HEADER */}
      <Flex w="100%" justify="space-between" mb={10}>
        <Heading fontSize="2xl">SIKUM</Heading>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Back
        </Button>
      </Flex>

      <Heading fontSize="3xl" mb={6}>
        Settings
      </Heading>

      <VStack w="100%" maxW="500px" spacing={6}>

        {/* EMAIL */}
        <Box w="100%">
          <Text fontWeight="bold">Email</Text>
          <Input value={storedUser.email} isDisabled bg="gray.100" />
        </Box>

        {/* NAME */}
        <Box w="100%">
          <Text fontWeight="bold">Name</Text>
          <Input value={storedUser.name} isDisabled bg="gray.100" />
        </Box>

        {/* PHONE NUMBER */}
        <Box w="100%">
          <Text mb={2}>Phone Number</Text>
          <Input
            placeholder="+385912345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Box>

        {/* NOTIFICATION TYPE */}
        <Box w="100%">
          <Text mb={2}>Notification Type</Text>
          <Select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
          >
            {types.map((t: any) => {
              const isPhoneChannel = t.key === "whatsapp" || t.key === "both";

              return (
                <option
                  key={t.key}
                  value={t.key}
                  disabled={isPhoneChannel && !phoneNumber}
                >
                  {t.label}
                </option>
              );
            })}
          </Select>
        </Box>

        {/* FREQUENCY */}
        {notificationType !== "none" && (
          <Box w="100%">
            <Text mb={2}>Frequency</Text>
            <Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              {frequencies.map((f: any) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </Select>
          </Box>
        )}

        {success && (
          <Alert status="success" borderRadius="lg">
            <AlertIcon />
            {success}
          </Alert>
        )}

        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Button bg="black" color="white" w="100%" onClick={save}>
          Save Changes
        </Button>
      </VStack>
    </Flex>
  );
}