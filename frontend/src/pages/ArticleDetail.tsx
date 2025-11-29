import { Flex, Heading, Text, Box, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function ArticleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { article } = location.state as { article: Article };

  if (!article) {
    return (
      <Flex
        bg="white"
        minH="100vh"
        direction="column"
        px={{ base: 6, md: 16 }}
        py={10}
        align="center"
        justify="center"
      >
        <Text>Article not found</Text>
        <Button mt={4} onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      bg="white"
      minH="100vh"
      direction="column"
      px={{ base: 6, md: 16 }}
      py={10}
    >
      {/* Header */}
      <Flex w="100%" justify="space-between" align="center" mb={8}>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          color="gray.600"
        >
          ← Back
        </Button>
      </Flex>

      {/* Article Content */}
      <Box maxW="800px" mx="auto" w="100%">
        {article.data.imageUrl && (
          <Box
            w="100%"
            h="400px"
            mb={6}
            borderRadius="lg"
            bgImage={`url(${article.data.imageUrl})`}
            bgSize="cover"
            bgPosition="center"
          />
        )}

        <Text fontSize="sm" color="gray.500" mb={3}>
          {article.data.category}
        </Text>

        <Heading fontSize="4xl" fontWeight="700" mb={6}>
          {article.data.title}
        </Heading>

        <Text fontSize="lg" color="gray.700" lineHeight="1.8" mb={8}>
          {article.data.summary}
        </Text>

        <Button
          as="a"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          bg="black"
          color="white"
          px={8}
          py={6}
          borderRadius="lg"
          _hover={{ bg: "gray.800" }}
        >
          Read Full Article
        </Button>
      </Box>
    </Flex>
  );
}
