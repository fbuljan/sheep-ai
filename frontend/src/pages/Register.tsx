import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";
import { registerUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");

    // Simple validation
    if (name.trim().length < 3) {
      setError("Name must have at least 3 characters");
      return;
    }
    if (!email.includes("@")) {
      setError("Invalid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
        preferredWebsites: [] // minimalno dok ne napravimo swipe
      });

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex
      minH="100vh"
      bgGradient="linear(to-br, #0B0F1A, #0A0D16, black)"
      align="center"
      justify="center"
      px={6}
    >
      <Box
        bg="whiteAlpha.50"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        border="1px solid rgba(255,255,255,0.1)"
        boxShadow="0 0 40px rgba(99,102,241,0.2)"
        p={10}
        w="full"
        maxW="sm"
      >
        <Flex direction="column" align="center" mb={8}>
          <Box
            fontSize="3xl"
            bgGradient="linear(to-br, purple.400, indigo.500)"
            w={14}
            h={14}
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            shadow="lg"
          >
          </Box>

          <Heading mt={6} color="white" fontSize="3xl" fontWeight="semibold">
            Create account
          </Heading>
        </Flex>

        <VStack spacing={5}>
          <Box w="full">
            <Text color="gray.300" mb={1} fontSize="sm">Name</Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              bg="whiteAlpha.100"
              color="white"
            />
          </Box>

          <Box w="full">
            <Text color="gray.300" mb={1} fontSize="sm">Email</Text>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="whiteAlpha.100"
              color="white"
            />
          </Box>

          <Box w="full">
            <Text color="gray.300" mb={1} fontSize="sm">Password</Text>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="whiteAlpha.100"
              color="white"
            />
          </Box>

          {error && <Text color="red.300">{error}</Text>}

          <Button
            w="full"
            py={6}
            color="white"
            bgGradient="linear(to-r, purple.500, indigo.600)"
            isLoading={loading}
            onClick={handleRegister}
          >
            Create account
          </Button>

          <Text color="gray.400" fontSize="sm">
            Already have an account?{" "}
            <a href="/" style={{ color: "#818CF8" }}>Sign in</a>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}