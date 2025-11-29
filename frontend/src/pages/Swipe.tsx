import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

export default function Swipe() {
  const location = useLocation();
  const navigate = useNavigate();
  const website = location.state?.website || "Unknown source";

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Placeholder items – ovdje će kasnije doći pravi scrapan THN sadržaj
  const fakeItems = [
    {
      title: `Security alert on ${website}`,
      summary:
        "A recent vulnerability has been reported affecting multiple systems. This is placeholder content for the swipe engine.",
    },
    {
      title: `New phishing campaign spotted`,
      summary:
        "A new phishing campaign is using lookalike domains to trick users into sharing credentials.",
    },
    {
      title: `Malware trend: stealthy loaders`,
      summary:
        "Stealthy malware loaders are increasingly used to stage multi-step attacks in corporate environments.",
    },
  ];

  const total = fakeItems.length;
  const current = fakeItems[index];
  const next = index < total - 1 ? fakeItems[index + 1] : null;

  const progressValue =
    total > 1 ? (index / (total - 1)) * 100 : 100;

  function goToNext(dir: "left" | "right") {
    setDirection(dir);

    setTimeout(() => {
      if (index < total - 1) {
        setIndex((prev) => prev + 1);
      } else {
        navigate("/dashboard");
      }
    }, 300); // trajanje exit animacije
  }

  function handleDragEnd(
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) {
    const offsetX = info.offset.x;
    const threshold = 120;

    if (offsetX > threshold) {
      goToNext("right");
    } else if (offsetX < -threshold) {
      goToNext("left");
    }
    // inače se zbog dragSnapToOrigin kartica vrati
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
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        mb={8}
      >
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
          fontSize="sm"
          color="gray.600"
          _hover={{ color: "black" }}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Flex>

      {/* TITLE + PROGRESS */}
      <Box w="100%" maxW="600px" mb={6}>
        <Heading
          fontSize="3xl"
          fontWeight="700"
          textAlign="left"
          mb={2}
        >
          Rate content from {website}
        </Heading>

        <Text color="gray.600" mb={3}>
          Help us learn what matters to you. Swipe through a few
          example items to train your profile.
        </Text>

        <Progress
          value={progressValue}
          size="sm"
          borderRadius="full"
          bg="gray.200"
          colorScheme="blackAlpha"
        />

        <Text
          mt={2}
          fontSize="sm"
          color="gray.500"
        >
          Card {Math.min(index + 1, total)} of {total}
        </Text>
      </Box>

      {/* CARD STACK AREA */}
      <Box
        position="relative"
        w="100%"
        maxW="600px"
        h="260px"
        mt={4}
      >
        {/* NEXT CARD (stack effect) */}
        {next && (
          <Box
            position="absolute"
            top="20px"
            left="0"
            right="0"
            mx="auto"
            w="100%"
            maxW="560px"
            borderRadius="lg"
            border="1px solid #E5E5E5"
            bg="gray.50"
            boxShadow="0 2px 8px rgba(0,0,0,0.04)"
            p={6}
            opacity={0.8}
            transform="scale(0.96)"
          >
            <Heading size="sm" mb={2}>
              {next.title}
            </Heading>
            <Text fontSize="sm" color="gray.500" noOfLines={2}>
              {next.summary}
            </Text>
          </Box>
        )}

        {/* CURRENT CARD – drag + animacije */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={index}
            position="absolute"
            top="0"
            left="0"
            right="0"
            mx="auto"
            w="100%"
            maxW="600px"
            bg="white"
            borderRadius="lg"
            border="1px solid #E5E5E5"
            boxShadow="0 4px 12px rgba(0,0,0,0.06)"
            p={8}
            textAlign="center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragSnapToOrigin
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { duration: 0.25 },
            }}
            exit={{
              opacity: 0,
              x: direction === "right" ? 220 : -220,
              rotate: direction === "right" ? 15 : -15,
              transition: { duration: 0.3 },
            }}
          >
            <Heading size="md" mb={4}>
              {current.title}
            </Heading>

            <Text color="gray.600" fontSize="md">
              {current.summary}
            </Text>
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* BUTTONS */}
      <Flex gap={6} mt={10}>
        <Button
          bg="gray.200"
          color="black"
          px={10}
          py={6}
          borderRadius="lg"
          fontSize="md"
          _hover={{ bg: "gray.300" }}
          onClick={() => goToNext("left")}
        >
          Skip
        </Button>

        <Button
          bg="black"
          color="white"
          px={10}
          py={6}
          borderRadius="lg"
          fontSize="md"
          _hover={{ bg: "gray.800" }}
          onClick={() => goToNext("right")}
        >
          Like
        </Button>
      </Flex>
    </Flex>
  );
}