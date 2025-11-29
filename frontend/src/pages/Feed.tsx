import { useEffect, useState } from "react";
import { Box, Text, Spinner, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Feed() {
  const location = useLocation();
  const source = location.state?.website; // passed from dashboard

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const userId = user?.id;

  const [articles, setArticles] = useState<any[]>([]);
  const [displayTypes, setDisplayTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------
  // FETCH ARTICLES + DISPLAY TYPES WITH DEBUG LOGS
  // -----------------------------------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);

      console.log("=== FEED INIT ===");
      console.log("User ID:", userId);
      console.log("Token:", token?.slice(0, 20) + "...");
      console.log("Source:", source);

      try {
        // ---------------------- ARTICLES FETCH ----------------------
        const artRes = await axios.get(
          `http://localhost:4000/users/${userId}/articles/${source}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("=== BACKEND ARTICLES RESPONSE ===");
        console.log("Raw:", artRes.data);
        console.log("Count:", artRes.data?.articles?.length);
        console.log("First article:", artRes.data?.articles?.[0]);

        setArticles(artRes.data.articles || []);
      } catch (err) {
        console.error("ERROR FETCHING ARTICLES:", err);
      }

      try {
        // ---------------------- DISPLAY TYPES FETCH ----------------------
        const typesRes = await axios.get(
          `http://localhost:4000/display-types/preferences/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("=== BACKEND DISPLAY TYPES RESPONSE ===");
        console.log("Raw:", typesRes.data);
        console.log("Array?", Array.isArray(typesRes.data));
        console.log("Length:", typesRes.data?.length);
        console.log("First type:", typesRes.data?.[0]);

        setDisplayTypes(typesRes.data || []);
      } catch (err) {
        console.error("ERROR FETCHING DISPLAY TYPES:", err);
      }

      setLoading(false);
    }

    load();
  }, [source, userId, token]);

  // -----------------------------------------------------
  // GENERATE SUMMARY CARDS
  // -----------------------------------------------------
  async function generate(article: any) {
    console.log("=== GENERATE START ===");
    console.log("Articles:", articles);
    console.log("DisplayTypes:", displayTypes);
    console.log("Articles length:", articles?.length);
    console.log("Display types length:", displayTypes?.length);

    if (!displayTypes || displayTypes.length === 0) {
      console.warn("No display types selected — cannot generate.");
      return "NO_DISPLAY_TYPES";
    }

    const randomType =
      displayTypes[Math.floor(Math.random() * displayTypes.length)];

    console.log("Chosen display type:", randomType);

    try {
      const res = await axios.post(
        "http://localhost:4000/chatgpt/article-summary",
        {
          articleId: article.id,
          displayTypeId: randomType.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("=== SUMMARY GENERATED ===", res.data);
      return res.data;
    } catch (err) {
      console.error("ERROR GENERATING SUMMARY:", err);
      return null;
    }
  }

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  if (loading) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Feed — {source}
      </Text>

      {articles.length === 0 && (
        <Text>No articles found for this website.</Text>
      )}

      {articles.map((a) => (
        <Box
          key={a.id}
          border="1px solid #ddd"
          borderRadius="lg"
          p={5}
          mb={5}
          onClick={() => generate(a)}
          cursor="pointer"
          _hover={{ bg: "gray.50" }}
        >
          <Text fontSize="lg" fontWeight="bold">
            {a.data.title}
          </Text>

          <Text fontSize="sm" color="gray.500">
            {a.url}
          </Text>

          <Text mt={3}>{a.data.summary}</Text>
        </Box>
      ))}
    </Box>
  );
}
