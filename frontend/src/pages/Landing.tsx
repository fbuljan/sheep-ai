import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg="white"
      px={{ base: 6, md: 16 }}
      py={8}
    >
      {/* HEADER */}
      <Flex justify="flex-end" align="center" mb={20} position="relative" zIndex={1}>
        <Logo absolute />

        <Button
          variant="ghost"
          fontSize="lg"
          color="gray.700"
          _hover={{ color: "black", transform: "translateY(-1px)" }}
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
      </Flex>

      {/* HERO CONTENT */}
      <Flex
        direction="column"
        justify="center"
        align="center"
        textAlign="center"
        flex="1"
      >
        <Heading
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="800"
          maxW="700px"
          lineHeight="1.15"
          mb={6}
        >
          Your Daily Brief.<br />
          Automatically Prepared.
        </Heading>

        <Text
          fontSize={{ base: "md", md: "xl" }}
          maxW="520px"
          color="gray.600"
          mb={16}
          lineHeight="1.6"
        >
          We monitor your sources and prepare<br />
          your brief automatically.
        </Text>

        {/* CARD BELOW */}
        <Box
          bg="white"
          py={6}
          px={10}
          borderRadius="2xl"
          boxShadow="0 12px 30px rgba(0,0,0,0.08)"
          _hover={{ boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
          transition="0.3s"
          cursor="pointer"
          onClick={() => navigate("/register")}
        >
          <Text fontSize="xl" fontWeight="600">
            Choose your source
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
