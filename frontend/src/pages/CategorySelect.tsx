import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const ALL_CATEGORIES = [
  "Malware",
  "Phishing",
  "Data Breaches",
  "Ransomware",
  "AI Agents",
  "Zero-Day",
  "Vulnerabilities",
  "Botnets",
  "Cloud Security",
  "Mobile Threats",
  "Insider Threats",
];

export default function CategorySelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const website = location.state?.website;
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(cat: string) {
    if (selected.includes(cat)) {
      setSelected(selected.filter((c) => c !== cat));
    } else {
      setSelected([...selected, cat]);
    }
  }

  function next() {
    navigate("/website-preferences", {
      state: {
        website,
        categories: selected,
      },
    });
  }

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
      <Flex w="100%" justify="space-between" align="center" mb={12}>
        <Heading
          fontWeight="600"
          fontSize="2xl"
          cursor="pointer"
          onClick={() => navigate("/dashboard")}
        >
          🐑 SheepAI
        </Heading>

        <Button
          variant="ghost"
          color="gray.600"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
      </Flex>

      <Heading fontSize="3xl" mb={4}>
        What topics interest you?
      </Heading>
      <Text color="gray.600" mb={10} maxW="600px" textAlign="center">
        Select the categories you care about the most.  
        These will personalize upcoming content.
      </Text>

      {/* GRID */}
      <SimpleGrid
        columns={{ base: 2, md: 3, lg: 4 }}
        spacing={4}
        maxW="800px"
        mb={12}
      >
        {ALL_CATEGORIES.map((cat) => {
          const active = selected.includes(cat);
          return (
            <Box
              key={cat}
              border="2px solid"
              borderColor={active ? "black" : "#E5E5E5"}
              bg={active ? "black" : "white"}
              color={active ? "white" : "black"}
              borderRadius="full"
              px={5}
              py={3}
              textAlign="center"
              cursor="pointer"
              onClick={() => toggle(cat)}
              transition="0.2s"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
              }}
            >
              {cat}
            </Box>
          );
        })}
      </SimpleGrid>

      <Button
        bg="black"
        color="white"
        px={10}
        py={6}
        borderRadius="lg"
        onClick={next}
        disabled={selected.length === 0}
      >
        Continue
      </Button>
    </Flex>
  );
}
