import { useEffect, useState } from "react";
import { Box, Text, Spinner, Flex, IconButton, Badge, Tag, Wrap, WrapItem } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBackIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, TimeIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

export default function Feed() {
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state?.website; // passed from dashboard

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const userId = user?.id;

  const [articles, setArticles] = useState<any[]>([]);
  const [displayTypes, setDisplayTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<number, string>>({});
  const [readTimes, setReadTimes] = useState<Record<number, string>>({});
  const [generating, setGenerating] = useState<Set<number>>(new Set());
  const [prefetchProgress, setPrefetchProgress] = useState({ done: 0, total: 0 });

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
          `${API_URL}/users/${userId}/articles/${source}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("=== BACKEND ARTICLES RESPONSE ===");
        console.log("Raw:", artRes.data);
        console.log("Count:", artRes.data?.articles?.length);
        console.log("First article:", artRes.data?.articles?.[0]);
        console.log("First article data keys:", Object.keys(artRes.data?.articles?.[0]?.data || {}));
        console.log("First article categories:", artRes.data?.articles?.[0]?.data?.categories);
        console.log("First article full data:", artRes.data?.articles?.[0]?.data);

        setArticles(artRes.data.articles || []);
      } catch (err) {
        console.error("ERROR FETCHING ARTICLES:", err);
      }

      try {
        // ---------------------- DISPLAY TYPES FETCH ----------------------
        const typesRes = await axios.get(
          `${API_URL}/display-types/preferences/${userId}`,
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
  // GENERATE SUMMARY FOR A SINGLE ARTICLE
  // -----------------------------------------------------
  async function generateSummary(article: any, types: any[]) {
    // Skip if already have content or currently generating
    if (generatedContent[article.id] || generating.has(article.id)) {
      return;
    }

    if (!types || types.length === 0) {
      setGeneratedContent((prev) => ({
        ...prev,
        [article.id]: "⚠️ No display types configured. Please set your preferences.",
      }));
      return;
    }

    setGenerating((prev) => new Set(prev).add(article.id));

    const randomType = types[Math.floor(Math.random() * types.length)];

    try {
      const res = await axios.post(
        `${API_URL}/chatgpt/article-summary`,
        {
          articleId: article.id,
          displayTypeId: randomType.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`=== SUMMARY GENERATED for ${article.id} ===`, res.data);
      setGeneratedContent((prev) => ({
        ...prev,
        [article.id]: res.data.summary || res.data.content || res.data,
      }));
      if (res.data.estimatedReadTime) {
        setReadTimes((prev) => ({
          ...prev,
          [article.id]: res.data.estimatedReadTime,
        }));
      }
      setPrefetchProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    } catch (err) {
      console.error(`ERROR GENERATING SUMMARY for ${article.id}:`, err);
      setGeneratedContent((prev) => ({
        ...prev,
        [article.id]: "❌ Failed to generate content. Please try again.",
      }));
    } finally {
      setGenerating((prev) => {
        const next = new Set(prev);
        next.delete(article.id);
        return next;
      });
    }
  }

  // -----------------------------------------------------
  // PREFETCH ALL SUMMARIES ON PAGE LOAD
  // -----------------------------------------------------
  useEffect(() => {
    if (loading || articles.length === 0 || displayTypes.length === 0) return;

    console.log("=== PREFETCHING ALL SUMMARIES ===");
    setPrefetchProgress({ done: 0, total: articles.length });

    // Generate summaries for all articles in parallel (with some concurrency limit)
    const CONCURRENCY = 3;
    let index = 0;

    async function processNext() {
      while (index < articles.length) {
        const article = articles[index++];
        await generateSummary(article, displayTypes);
      }
    }

    // Start multiple workers
    const workers = Array(Math.min(CONCURRENCY, articles.length))
      .fill(null)
      .map(() => processNext());

    Promise.all(workers).then(() => {
      console.log("=== ALL SUMMARIES PREFETCHED ===");
    });
  }, [loading, articles, displayTypes]);

  // -----------------------------------------------------
  // TOGGLE EXPAND (no longer generates, just toggles)
  // -----------------------------------------------------
  function handleArticleClick(article: any) {
    if (expandedId === article.id) {
      setExpandedId(null);
    } else {
      setExpandedId(article.id);
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
      <Flex align="center" gap={4} mb={6}>
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate(-1)}
        />
        <Text fontSize="2xl" fontWeight="bold">
          Feed of {source}
        </Text>
        {prefetchProgress.total > 0 && prefetchProgress.done < prefetchProgress.total && (
          <Flex align="center" gap={2}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="sm" color="gray.500">
              Loading summaries ({prefetchProgress.done}/{prefetchProgress.total})
            </Text>
          </Flex>
        )}
        {prefetchProgress.total > 0 && prefetchProgress.done === prefetchProgress.total && (
          <Badge colorScheme="green">All summaries ready</Badge>
        )}
      </Flex>

      {articles.length === 0 && (
        <Text>No articles found for this website.</Text>
      )}

      {articles.map((a) => {
        const isExpanded = expandedId === a.id;
        const isGenerating = generating.has(a.id);
        const content = generatedContent[a.id];
        const readTime = readTimes[a.id];

        return (
          <Box
            key={a.id}
            as={motion.div}
            layout
            border="1px solid"
            borderColor={isExpanded ? "blue.300" : "gray.200"}
            borderRadius="xl"
            p={5}
            mb={5}
            cursor="pointer"
            onClick={() => handleArticleClick(a)}
            bg={isExpanded ? "blue.50" : "white"}
            boxShadow={isExpanded ? "lg" : "sm"}
            sx={{ transition: "all 0.2s" }}
            _hover={{
              borderColor: "blue.300",
              boxShadow: "md",
              transform: isExpanded ? "none" : "translateY(-2px)"
            }}
          >
            {/* Header */}
            <Flex justify="space-between" align="flex-start">
              <Box flex="1">
                <Text fontSize="lg" fontWeight="bold" color={isExpanded ? "blue.700" : "gray.800"}>
                  {a.data.title}
                </Text>
                <Flex align="center" gap={2} mt={1}>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {a.url}
                  </Text>
                  <IconButton
                    aria-label="Open link"
                    icon={<ExternalLinkIcon />}
                    size="xs"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(a.url, "_blank");
                    }}
                  />
                </Flex>
              </Box>
              <Flex align="center" gap={2}>
                {readTime && (
                  <Badge colorScheme="purple" display="flex" alignItems="center" gap={1}>
                    <TimeIcon boxSize={3} />
                    {readTime}
                  </Badge>
                )}
                <Badge colorScheme={isExpanded ? "blue" : "gray"}>
                  {isExpanded ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />}
                </Badge>
              </Flex>
            </Flex>

            {/* Categories */}
            {a.data.categories && a.data.categories.length > 0 && (
              <Wrap mt={3} spacing={2}>
                {a.data.categories.map((cat: string, idx: number) => (
                  <WrapItem key={idx}>
                    <Tag
                      size="sm"
                      borderRadius="full"
                      variant="subtle"
                      colorScheme="teal"
                    >
                      {cat}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            )}

            {/* Preview (always visible) */}
            <Box mt={3} color="gray.600" fontSize="sm">
              <Text noOfLines={isExpanded ? undefined : 2}>
                {a.data.summary}
              </Text>
            </Box>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <MotionBox
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  overflow="hidden"
                >
                  <Box
                    mt={4}
                    pt={4}
                    borderTop="1px solid"
                    borderColor="blue.200"
                  >
                    {isGenerating ? (
                      <Flex align="center" gap={3} py={4}>
                        <Spinner size="sm" color="blue.500" />
                        <Text color="blue.600" fontStyle="italic">
                          Generating personalized summary...
                        </Text>
                      </Flex>
                    ) : content ? (
                      <Box
                        bg="white"
                        p={4}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        sx={{
                          "& h1, & h2, & h3": {
                            fontWeight: "bold",
                            mt: 3,
                            mb: 2,
                          },
                          "& h1": { fontSize: "xl" },
                          "& h2": { fontSize: "lg" },
                          "& h3": { fontSize: "md" },
                          "& p": { mb: 2 },
                          "& ul, & ol": { pl: 6, mb: 2 },
                          "& li": { mb: 1 },
                          "& code": {
                            bg: "gray.100",
                            px: 1,
                            borderRadius: "sm",
                            fontSize: "sm",
                          },
                          "& pre": {
                            bg: "gray.100",
                            p: 3,
                            borderRadius: "md",
                            overflow: "auto",
                            mb: 2,
                          },
                          "& blockquote": {
                            borderLeft: "3px solid",
                            borderColor: "blue.300",
                            pl: 3,
                            fontStyle: "italic",
                            color: "gray.600",
                          },
                        }}
                      >
                        <ReactMarkdown>{String(content)}</ReactMarkdown>
                      </Box>
                    ) : (
                      <Text color="gray.500" fontStyle="italic">
                        Click to generate content...
                      </Text>
                    )}
                  </Box>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        );
      })}
    </Box>
  );
}
