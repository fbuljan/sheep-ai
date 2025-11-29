import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchCategories } from "../api/categories";
import { API_URL } from "../config/api";

export default function CategorySelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const website: string = location.state?.website;

  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ➤ Ako nema website → odmah redirect
  useEffect(() => {
    if (!website || website.trim() === "") {
      navigate("/add-website");
    }
  }, [website, navigate]);

  // ➤ Normalizacija website imena (uklanja http, www)
  const displayName =
    website
      ?.replace("https://", "")
      .replace("http://", "")
      .replace("www.", "") || "";

  // Load categories from backend
  useEffect(() => {
    if (!website) return;

    async function load() {
      try {
        setLoading(true);

        const res = await fetchCategories(website);
        console.log("Backend categories:", res);

        const names = res.categories.categories.map((c: any) => c.name);
        setCategories(names);
      } catch (err) {
        console.error(err);
        setError("Could not load categories for this source.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [website]);

  function toggle(cat: string) {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  // ➤ Save preferences
  async function next() {
    try {
      setSaving(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      const userId = user?.id;

      if (!userId || !token) {
        toast({
          title: "Not logged in",
          description: "Please sign in again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
        return;
      }

      // LOCAL STORAGE UPDATE
      const localPrefs = JSON.parse(
        localStorage.getItem("websitePreferences") || "{}"
      );
      localPrefs[website] = { categories: selected };
      localStorage.setItem("websitePreferences", JSON.stringify(localPrefs));

      // BACKEND UPDATE (backend requires an array of websites, not object)
      const websiteArray = Object.keys(localPrefs); // ← FIX

      await axios.put(
        `${API_URL}/users/${userId}/preferred-websites`,
        { preferredWebsites: websiteArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Preferences saved!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/swipe", {
        state: { website, categories: selected },
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error saving preferences",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
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
          fontWeight="700"
          fontSize="2xl"
          cursor="pointer"
          onClick={() => navigate("/dashboard")}
        >
          SIKUM
        </Heading>

        <Button variant="ghost" color="gray.600" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
      </Flex>

      {/* PAGE TITLE */}
      <Heading fontSize="3xl" mb={3} fontWeight="700">
        What topics interest you?
      </Heading>

      <Text color="gray.600" mb={10} maxW="600px" textAlign="center" fontSize="md">
        These categories were detected based on articles from{" "}
        <b>{displayName}</b>.
      </Text>

      {/* LOADING */}
      {loading && (
        <Flex direction="column" align="center" mt={20}>
          <Spinner size="xl" thickness="5px" color="black" />
          <Text mt={6} fontSize="lg">
            Analyzing articles…
          </Text>
        </Flex>
      )}

      {/* ERROR */}
      {error && !loading && (
        <Alert status="error" mb={6} borderRadius="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* CATEGORY GRID */}
      {!loading && categories.length > 0 && (
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
            spacing={5}
            maxW="800px"
            mb={12}
            w="100%"
          >
            {categories.map((cat) => {
              const active = selected.includes(cat);
              return (
                <Box
                  key={cat}
                  border="2px solid"
                  borderColor={active ? "black" : "#E4E4E4"}
                  bg={active ? "black" : "white"}
                  color={active ? "white" : "black"}
                  borderRadius="full"
                  px={7}
                  py={4}
                  fontSize="md"
                  fontWeight="500"
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => toggle(cat)}
                  transition="0.2s ease"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  {cat}
                </Box>
              );
            })}
          </SimpleGrid>

          {/* CONTINUE BUTTON */}
          <Button
            bg="black"
            color="white"
            px={12}
            py={7}
            borderRadius="xl"
            fontSize="lg"
            fontWeight="600"
            onClick={next}
            disabled={selected.length === 0 || saving}
            _hover={{ bg: "gray.800" }}
          >
            {saving ? <Spinner color="white" /> : "Continue to Swipe"}
          </Button>

        </>
      )}
    </Flex>
  );
}
