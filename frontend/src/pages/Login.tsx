import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export default function Login() {
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
            Sign in
          </Heading>

          <Text color="gray.400" fontSize="sm">
            Welcome back to SheepAI
          </Text>
        </Flex>

        <VStack spacing={5}>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">
              Email
            </FormLabel>
            <Input
              placeholder="you@example.com"
              type="email"
              bg="whiteAlpha.100"
              border="1px solid rgba(255,255,255,0.1)"
              color="white"
              _placeholder={{ color: "gray.500" }}
              _focus={{ borderColor: "purple.400" }}
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">
              Password
            </FormLabel>
            <Input
              placeholder="••••••••"
              type="password"
              bg="whiteAlpha.100"
              border="1px solid rgba(255,255,255,0.1)"
              color="white"
              _placeholder={{ color: "gray.500" }}
              _focus={{ borderColor: "purple.400" }}
            />
          </FormControl>

          <Button
            w="full"
            mt={2}
            py={6}
            color="white"
            bgGradient="linear(to-r, purple.500, indigo.600)"
            _hover={{ opacity: 0.9 }}
            borderRadius="xl"
            shadow="xl"
          >
            Continue
          </Button>

          <Text fontSize="sm" color="gray.400" mt={2}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#818CF8" }}>
              Create one
            </a>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}