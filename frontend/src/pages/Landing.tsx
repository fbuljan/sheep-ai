import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMic } from "react-icons/fi";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Flex
      minH="100vh"
      direction="column"
      bg="white"
      color="black"
      px={{ base: 6, md: 20 }}
      py={10}
    >
      {/* TOP BAR */}
      <Flex justify="flex-end" gap={6} mb={16}>
        <Button
          variant="ghost"
          fontWeight="medium"
          fontSize="lg"
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>

        <Button
          bg="black"
          color="white"
          _hover={{ bg: "gray.900" }}
          px={6}
          py={5}
          borderRadius="lg"
          fontWeight="600"
          onClick={() => navigate("/login")} // demo ide u login zasad
        >
          TRY DEMO
        </Button>
      </Flex>

      {/* CENTER HERO */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        maxW="800px"
        mx="auto"
      >
        <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold">
          Your Daily Brief. <br /> Automatically Prepared.
        </Heading>

        <Text
          fontSize="xl"
          color="gray.700"
          mt={6}
          maxW="600px"
        >
          The system continuously monitors your selected sources and delivers
          a clean, personalized summary the moment you open the app.
        </Text>

        {/* SEARCH BAR */}
        <InputGroup
          bg="white"
          border="2px solid #ddd"
          borderRadius="full"
          px={4}
          py={2}
          mt={12}
          maxW="600px"
        >
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.500" boxSize={5} />
          </InputLeftElement>

          <Input
            placeholder="Get your brief"
            borderRadius="full"
            fontSize="lg"
            _placeholder={{ color: "gray.500" }}
          />

          <InputRightElement>
            <Icon as={FiMic} color="gray.500" boxSize={6} />
          </InputRightElement>
        </InputGroup>
      </Flex>

      {/* FEATURES */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={14}
        mt={28}
        maxW="900px"
        mx="auto"
      >
        <Box>
          <Heading size="md" mb={3}>
            Continuous Monitoring
          </Heading>
          <Text color="gray.600" fontSize="md">
            We track your selected sources on a fixed schedule and detect new
            incidents instantly.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Personalized Brief
          </Heading>
          <Text color="gray.600" fontSize="md">
            Your interests define what appears in your daily summary.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Multi-Format Summaries
          </Heading>
          <Text color="gray.600" fontSize="md">
            Each incident is available as text, highlights, audio, or a short
            script.
          </Text>
        </Box>
      </SimpleGrid>
    </Flex>
  );
}