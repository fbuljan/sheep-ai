import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, Flex, Heading, useToast, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import { API_URL } from "../config/api";

export default function AddWebsite() {
  const [url, setUrl] = useState("");
  const [existing, setExisting] = useState<string[]>([]);
  const navigate = useNavigate();
  const toast = useToast();

  // Load existing websites from backend
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !user.id) return navigate("/login");

        const res = await axios.get(`${API_URL}/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExisting(res.data.preferredWebsites || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [navigate]);

  function normalizeSource(url: string) {
    return url
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split(".")[0]
      .trim()
      .toLowerCase();
  }

  function handleNext() {
    const source = normalizeSource(url);

    if (!source) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid website URL.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (existing.includes(source)) {
      toast({
        title: "Website already added",
        description: `${source} is already in your dashboard.`,
        status: "warning",
        duration: 3000,
      });
      return;
    }

    navigate("/categories", { state: { website: source } });
  }

  return (
    <Flex minH="100vh" align="center" justify="center" direction="column" bg="white" px={6}>
      <Flex w="100%" maxW="500px" mb={6}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Back"
          bg="white"
          border="1px solid #ddd"
          onClick={() => navigate("/dashboard")}
        />
      </Flex>

      <Box p={8} border="1px solid #eee" borderRadius="lg" boxShadow="md" maxW="500px" w="100%">
        <Heading mb={4} fontWeight="600" fontSize="2xl">
          Add a Website
        </Heading>

        <Input
          placeholder="https://thehackernews.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          p={6}
          mb={4}
          borderRadius="lg"
          border="1px solid #ddd"
        />

        <Button w="full" bg="black" color="white" py={6} borderRadius="lg" onClick={handleNext}>
          Continue
        </Button>
      </Box>
    </Flex>
  );
}