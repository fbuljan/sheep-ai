import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("websitePreferences") || "{}"
    );
    setWebsites(Object.keys(stored));
  }, []);

  function addWebsite() {
    navigate("/categories", { state: { website: "" } });
  }

  function openWebsite(domain: string) {
    const prefs = JSON.parse(
      localStorage.getItem("websitePreferences") || "{}"
    );

    navigate("/swipe", {
      state: {
        website: domain,
        categories: prefs[domain]?.categories || [],
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
        <Heading fontWeight="600" fontSize="2xl">
          🐑 Dashboard
        </Heading>

        <Button
          variant="ghost"
          color="gray.600"
          _hover={{ color: "black" }}
          onClick={() => navigate("/settings")}
        >
          Settings
        </Button>
      </Flex>

      {/* TITLE */}
      <Heading fontSize="3xl" mb={3}>
        Your Websites
      </Heading>

      <Text color="gray.600" mb={10} textAlign="center">
        Click a website to explore your personalized brief.
      </Text>

      {/* ADD BUTTON */}
      <Button
        bg="black"
        color="white"
        px={8}
        py={5}
        borderRadius="lg"
        mb={10}
        _hover={{ bg: "gray.800" }}
        onClick={addWebsite}
      >
        + Add New Website
      </Button>

      {/* WEBSITE GRID */}
      {websites.length === 0 ? (
        <Text color="gray.500" fontSize="lg" mt={10}>
          You haven't added any websites yet.
        </Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
          w="100%"
          maxW="1000px"
        >
          {websites.map((domain) => (
            <Box
              key={domain}
              border="1px solid #E5E5E5"
              borderRadius="lg"
              p={8}
              bg="white"
              cursor="pointer"
              transition="0.2s"
              textAlign="center"
              fontWeight="600"
              fontSize="lg"
              boxShadow="0 4px 8px rgba(0,0,0,0.05)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
              }}
              onClick={() => openWebsite(domain)}
            >
              {domain}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
}