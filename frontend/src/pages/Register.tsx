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
  Link,
  Spinner,
} from "@chakra-ui/react";
import { registerUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");

    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }
    if (!email.includes("@")) {
      setError("Email is invalid");
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
        preferredWebsites: []
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
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

      <Box w="full" maxW="420px" textAlign="center">
        <Heading mb={4} fontWeight="600">
          Create your account
        </Heading>

        <Text color="gray.600" fontSize="md" mb={10}>
          Join and start building your personalized daily brief.
        </Text>

        {loading && (
          <Spinner size="lg" color="black" mb={4} thickness="3px" />
        )}

        <VStack spacing={5}>
          <Input
            placeholder="Full name"
            bg="white"
            border="2px solid #e5e5e5"
            borderRadius="lg"
            p={6}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Email"
            bg="white"
            border="2px solid #e5e5e5"
            borderRadius="lg"
            p={6}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            bg="white"
            border="2px solid #e5e5e5"
            borderRadius="lg"
            p={6}
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
            onClick={handleRegister}
          >
            Create account
          </Button>

          <Text fontSize="sm" color="gray.600">
            Already have an account?{" "}
            <Link color="blue.500" onClick={() => navigate("/login")}>
              Sign in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}