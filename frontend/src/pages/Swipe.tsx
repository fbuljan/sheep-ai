import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Swipe() {
  const location = useLocation();
  const navigate = useNavigate();
  const website = location.state?.website || "Unknown site";

  const [index, setIndex] = useState(0);

  // fake swipe cards (kasnije će ovo biti članci)
  const fakeItems = [
    { title: "Security alert on " + website, summary: "Lorem ipsum…" },
    { title: "New update on " + website, summary: "Dolor sit amet…" },
    { title: "Trending threat: malware", summary: "Possible issue…" },
  ];

  const item = fakeItems[index];

  function swipe(direction: "left" | "right") {
    if (index < fakeItems.length - 1) {
      setIndex(index + 1);
    } else {
      // done
      navigate("/dashboard");
    }
  }

  return (
    <Flex
      minH="100vh"
      bg="#0A0D16"
      color="white"
      direction="column"
      align="center"
      justify="center"
      p={6}
    >
      <Heading size="lg" mb={6}>
        Rate articles from {website}
      </Heading>

      <Box
        bg="whiteAlpha.100"
        p={8}
        borderRadius="2xl"
        border="1px solid rgba(255,255,255,0.1)"
        w="full"
        maxW="md"
        textAlign="center"
      >
        <Heading size="md">{item.title}</Heading>
        <Text mt={3} color="gray.400">
          {item.summary}
        </Text>
      </Box>

      <Flex mt={6} gap={4}>
        <Button
          w="120px"
          bg="red.500"
          _hover={{ bg: "red.600" }}
          onClick={() => swipe("left")}
        >
          Skip
        </Button>

        <Button
          w="120px"
          bg="green.500"
          _hover={{ bg: "green.600" }}
          onClick={() => swipe("right")}
        >
          Like
        </Button>
      </Flex>
    </Flex>
  );
}