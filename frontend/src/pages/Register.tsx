import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Select,
  VStack,
  Alert,
  AlertIcon,
  Spinner
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [notificationType, setNotificationType] = useState("none");
  const [frequency, setFrequency] = useState("daily");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [types, setTypes] = useState<any[]>([]);
  const [frequencies, setFrequencies] = useState<any[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load available options from backend
  useEffect(() => {
    axios.get(`${API_URL}/notifications/types`)
      .then(res => setTypes(res.data))
      .catch(() => {}); 

    axios.get(`${API_URL}/notifications/frequencies`)
      .then(res => setFrequencies(res.data))
      .catch(() => {});
  }, []);

  function validateFields() {
    // RESET
    setError("");

    // NAME
    if (!name.trim()) {
      setError("Name is required.");
      return false;
    }

    // EMAIL
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // PASSWORD
    if (!password.trim()) {
      setError("Password is required.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    // Phone validation
    if ((notificationType === "whatsapp" || notificationType === "both")) {
      if (!phoneNumber.trim()) {
        setError("Phone number is required for WhatsApp notifications.");
        return false;
      }

      const phoneRegex = /^\+?[0-9]{7,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("Invalid phone number format. Use: +385912345678");
        return false;
      }
    }

    return true;
  }

  async function register() {
    if (!validateFields()) return;

    try {
      setLoading(true);

      // Create user
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        preferredWebsites: [],
        phoneNumber: phoneNumber || "",
      });

      const userId = res.data.id;

      // Save notification preferences
      await axios.put(`${API_URL}/notifications/preferences/${userId}`, {
        notificationType,
        notificationFrequency: notificationType === "none" ? null : frequency
      });

      // Save phone number
      if (phoneNumber.trim()) {
        await axios.put(`${API_URL}/auth/phone/${userId}`, {
          phoneNumber,
        });
      }

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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
      <Flex w="100%" justify="space-between" mb={12}>
        <Heading fontSize="2xl">SIKUM</Heading>
        <Button variant="ghost" onClick={() => navigate("/")}>Cancel</Button>
      </Flex>

      <Heading fontSize="3xl" mb={3}>Create your account</Heading>

      <VStack spacing={6} maxW="500px" w="100%" mt={8}>
        
        {/* NAME */}
        <Box w="100%">
          <Text mb={2}>Name</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        </Box>

        {/* EMAIL */}
        <Box w="100%">
          <Text mb={2}>Email</Text>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
          />
        </Box>

        {/* PASSWORD */}
        <Box w="100%">
          <Text mb={2}>Password</Text>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Box>

        {/* NOTIFICATION TYPE */}
        <Box w="100%">
          <Text mb={2}>Notification Type</Text>
          <Select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
          >
            {types.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </Select>
        </Box>

        {/* FREQUENCY (only when notifications != none) */}
        {notificationType !== "none" && (
          <Box w="100%">
            <Text mb={2}>Frequency</Text>
            <Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              {frequencies.map((f) => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </Select>
          </Box>
        )}

        {/* PHONE NUMBER (only for WhatsApp/Both) */}
        {(notificationType === "whatsapp" || notificationType === "both") && (
          <Box w="100%">
            <Text mb={2}>Phone Number</Text>
            <Input
              placeholder="+385912345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Box>
        )}

        {/* LOADING */}
        {loading && <Spinner size="lg" thickness="4px" />}

        {/* ERRORS */}
        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* SUBMIT */}
        <Button bg="black" color="white" w="100%" onClick={register}>
          Create Account
        </Button>
      </VStack>
    </Flex>
  );
}