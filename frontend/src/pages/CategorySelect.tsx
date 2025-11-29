import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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

  const [website, setWebsite] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState(1); // 1 = enter website, 2 = categories
  const [error, setError] = useState("");

  async function validateWebsite() {
    setError("");

    if (!website.trim()) {
      setError("Please enter a website.");
      return;
    }

    const clean = website
      .replace("https://", "")
      .replace("http://", "")
      .split("/")[0];

    if (!clean.includes(".")) {
      setError("Please enter a valid domain (e.g. example.com).");
      return;
    }

    setWebsite(clean);

    // Save preferred website to backend
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const currentWebsites = user.preferredWebsites || [];

        // Only add if not already in the list
        if (!currentWebsites.includes(clean)) {
          const updatedWebsites = [...currentWebsites, clean];

          const response = await axios.put(
            `http://localhost:4000/users/${user.id}/preferred-websites`,
            { preferredWebsites: updatedWebsites }
          );

          // Update local storage with new user data
          const updatedUser = { ...user, preferredWebsites: updatedWebsites };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error("Error saving preferred website:", err);
      // Continue anyway - don't block the user
    }

    setStep(2);
  }

  function toggle(cat: string) {
    if (selected.includes(cat)) {
      setSelected(selected.filter((c) => c !== cat));
    } else {
      setSelected([...selected, cat]);
    }
  }

  function next() {
    navigate("/swipe", {
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
          SIKUM
        </Heading>

        <Button
          variant="ghost"
          color="gray.600"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
      </Flex>

      {/* STEP 1 — ENTER WEBSITE */}
      {step === 1 && (
        <>
          <Heading fontSize="3xl" mb={4}>
            Add a Website
          </Heading>
          <Text color="gray.600" mb={8} textAlign="center" maxW="600px">
            Enter the website you want to train your personal brief on.
          </Text>

          <Box w="100%" maxW="500px" mb={4}>
            <Input
              placeholder="example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              border="2px solid #E5E5E5"
              borderRadius="lg"
              p={6}
            />
          </Box>

          {error && <Text color="red.500" mb={4}>{error}</Text>}

          <Button
            bg="black"
            color="white"
            px={10}
            py={6}
            borderRadius="lg"
            onClick={validateWebsite}
          >
            Continue
          </Button>
        </>
      )}

      {/* STEP 2 — CATEGORY SELECTION */}
      {step === 2 && (
        <>
          <Heading fontSize="3xl" mb={4}>
            What topics interest you?
          </Heading>
          <Text color="gray.600" mb={10} textAlign="center" maxW="600px">
            These will be used to personalize your content from {website}.
          </Text>

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
            Continue to Swipe
          </Button>
        </>
      )}
    </Flex>
  );
}