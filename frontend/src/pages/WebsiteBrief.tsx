import { Flex, Heading, SimpleGrid, Box, Text, Spinner } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

interface Article {
  id: number;
  url: string;
  data: {
    title: string;
    summary: string;
    category: string;
    imageUrl?: string;
  };
  scrapedAt: string;
  source: string;
}

export default function WebsiteBrief() {
  const location = useLocation();
  const navigate = useNavigate();
  const { website } = location.state || { website: "Unknown Website" };

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?.id;
    async function fetchArticles() {
      try {
        // normalize website "thehackernews.com" -> "thehackernews"
        const source = website.split(".")[0];

        const response = await axios.get(
          `${API_URL}/users/${userId}/articles/${source}`,
        );

        setArticles(response.data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }

    if (website) {
      fetchArticles();
    }
  }, [website]);

  function openArticle(article: Article) {
    navigate("/article-detail", {
      state: { article },
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
      <Heading fontSize="3xl" fontWeight="600" mb={10}>
        {website}
      </Heading>

      {loading ? (
        <Spinner size="xl" color="black" />
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={6}
          w="100%"
          maxW="1200px"
        >
          {articles.map((article) => (
            <Box
              key={article.id}
              border="1px solid #E5E5E5"
              borderRadius="lg"
              p={6}
              bg="white"
              cursor="pointer"
              transition="0.2s"
              boxShadow="0 4px 8px rgba(0,0,0,0.05)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
              }}
              onClick={() => openArticle(article)}
            >
              {article.data.imageUrl && (
                <Box
                  w="100%"
                  h="150px"
                  mb={4}
                  borderRadius="md"
                  bgImage={`url(${article.data.imageUrl})`}
                  bgSize="cover"
                  bgPosition="center"
                />
              )}
              <Text fontSize="sm" color="gray.500" mb={2}>
                {article.data.category}
              </Text>
              <Heading fontSize="lg" fontWeight="600" mb={2}>
                {article.data.title}
              </Heading>
              <Text fontSize="sm" color="gray.600" noOfLines={3}>
                {article.data.summary}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
}
