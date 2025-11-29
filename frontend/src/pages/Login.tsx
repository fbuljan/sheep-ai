import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Link,
  Spinner,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        password
      });

      // Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex
      bg="white"
      minH="100vh"
      direction="column"
      align="center"
      justify="center"
      px={6}
    >
      {/* Logo top */}
      <Flex
        position="absolute"
        top="30px"
        left="30px"
        fontSize="2xl"
        fontWeight="bold"
        cursor="pointer"
        onClick={() => navigate("/")}
      >
        SheepAI
      </Flex>

      {/* Container */}
      <Box w="full" maxW="420px" textAlign="center">
        <Heading mb={4} fontWeight="600">
          Sign in to your account
        </Heading>

        <Text color="gray.600" fontSize="md" mb={10}>
          Continue where you left off.
        </Text>

        {loading && (
          <Spinner size="lg" color="black" mb={4} thickness="3px" />
        )}

        {error && (
          <Alert status="error" mb={4} borderRadius="lg">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={5}>
          <Input
            placeholder="Email"
            bg="white"
            border="2px solid #e5e5e5"
            borderRadius="lg"
            p={6}
            fontSize="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            bg="white"
            border="2px solid #e5e5e5"
            borderRadius="lg"
            p={6}
            fontSize="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            w="full"
            bg="black"
            color="white"
            py={6}
            borderRadius="lg"
            fontSize="md"
            _hover={{ bg: "gray.800" }}
            onClick={handleLogin}
          >
            Sign in
          </Button>

          <Text fontSize="sm" color="gray.600">
            Don’t have an account?{" "}
            <Link color="blue.500" onClick={() => navigate("/register")}>
              Create one
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}