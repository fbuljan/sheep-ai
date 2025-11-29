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
  Spinner
} from "@chakra-ui/react";

import { loginUser } from "../api/auth";

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
    try {
      setError("");
      setLoading(true);

      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
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
          Continue where you left off in your personalized brief.
        </Text>

        {loading && (
          <Spinner size="lg" color="black" mb={4} thickness="3px" />
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

          {error && <Text color="red.500">{error}</Text>}

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