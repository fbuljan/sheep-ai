import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  Progress,
  Image,
  useToast
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import axios from "axios";
import { API_URL } from "../config/api";

const MotionBox = motion(Box);

// MAPPING: your swipe card IDs → backend displayType IDs
const DISPLAY_MAP: Record<string, string | null> = {
  "tech-bullet": "tech_bullets",
  "story-mode": "story_mode",
  "deep-brief": "executive_summary",
  "micro-summary": "micro_summary",

  // coming soon = ignore
  podcast: null,
  video: null,
};

export default function Swipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const website: string | undefined = location.state?.website;

  // -------------------------------------
  // HARD CODED DEMO CONTENT CARDS
  // -------------------------------------
  const contentCards = [
    {
      id: "tech-bullet",
      type: "Tech Bullet Summary",
      header: "TECH BULLET SUMMARY",
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      bullets: [
        "Guest access uses the host tenant’s security policies.",
        "Defender protections do not follow users across tenants.",
        "Attackers can create malicious tenants cheaply.",
        "Guest invites bypass email authentication checks.",
        "Malware/phishing links delivered undetected."
      ],
      risk: "High",
    },

    {
      id: "story-mode",
      type: "Story Mode Summary",
      header: "STORY MODE SUMMARY",
      title: "Imagine stepping into someone else’s digital workspace.",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      text:
        "The moment you do, your company’s security stays behind. If the workspace belongs to an attacker, they can send harmful links or files—and your company won’t see a thing.",
      image: "/story.png",
    },

    {
      id: "deep-brief",
      type: "Deep Structured Brief",
      header: "DEEP STRUCTURED BRIEF",
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      sections: {
        "What happened":
          "Joining an external Teams tenant applies that tenant’s security controls.",
        "How the attack works":
          "Attackers create a cheap MS tenant with no safeguards and send guest invites.",
        Impact:
          "Malware or phishing delivered undetected because it happens outside org security boundary.",
      },
    },

    {
      id: "micro-summary",
      type: "Micro Summary",
      header: "MICRO SUMMARY",
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      summary:
        "Teams guest access lets attackers place users inside external tenants where protections do not apply.",
    },

    {
      id: "podcast",
      type: "Podcast",
      header: "PODCAST",
      comingSoon: true,
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      summary:
        "In today's briefing: researchers found a gap in Teams guest access attackers can abuse.",
      image: "/podcast.png",
    },

    {
      id: "video",
      type: "Video",
      header: "VIDEO",
      comingSoon: true,
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      summary: "Watch a short video presentation of the key points.",
      image: "/video.png",
    }
  ];

  // intro + content steps
  const totalSteps = 1 + contentCards.length;
  const [step, setStep] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const baseOpacity = useTransform(x, [-200, 0, 200], [0.4, 1, 0.4]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const skipOpacity = useTransform(x, [-140, -40], [1, 0]);

  const isIntro = step === 0;
  const currentCard = step > 0 ? contentCards[step - 1] : null;

  // -------------------------------------
  // SAVE PREFERENCES TO BACKEND
  // -------------------------------------
  async function savePreferencesToBackend() {
    try {
      setSaving(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;

      if (!userId) {
        toast({
          title: "Not logged in",
          status: "error",
        });
        navigate("/login");
        return;
      }

      const chosen = liked
        .map((id) => DISPLAY_MAP[id])
        .filter((x): x is string => x !== null);

      await axios.post(`${API_URL}/display-types/preferences`, {
        userId,
        displayTypeIds: chosen,
      });

      toast({
        title: "Preferences saved!",
        status: "success",
        duration: 2000,
      });

    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to save preferences",
        status: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------
  // HANDLE SWIPING
  // -------------------------------------
  function goNext(decision?: "like" | "skip") {
    if (isIntro) {
      setStep(1);
      return;
    }

    if (currentCard && decision) {
      if (decision === "like") setLiked((p) => [...p, currentCard.id]);
      else setSkipped((p) => [...p, currentCard.id]);
    }

    if (step >= totalSteps - 1) {
      savePreferencesToBackend().then(() => navigate("/dashboard"));
      return;
    }

    setStep((prev) => prev + 1);
    x.set(0);
  }

  function handleDragEnd(_: any, info: { offset: { x: number } }) {
    const offsetX = info.offset.x;
    if (offsetX > 120) goNext("like");
    else if (offsetX < -120) goNext("skip");
    else x.set(0);
  }

  function handleButton(decision: "like" | "skip") {
    if (currentCard?.comingSoon && decision === "like") return;
    goNext(decision);
  }

  const progressValue = step === 0 ? 0 : (step / (totalSteps - 1)) * 100;

  // -------------------------------------
  // INTRO CARD
  // -------------------------------------
  function renderIntroCard() {
    return (
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="0 12px 30px rgba(0,0,0,0.10)"
        p={8}
        maxW="480px"
        w="100%"
      >
        <Heading fontSize="2xl" mb={4}>
          How SIKUM learns your style
        </Heading>

        <Box mb={6}>
          <Text mb={2}>• Swipe <b>right</b> to keep</Text>
          <Text mb={2}>• Swipe <b>left</b> to skip</Text>
          <Text mb={2}>• Podcast & Video → <b>coming soon</b></Text>
        </Box>

        <Button
          w="100%"
          bg="black"
          color="white"
          py={6}
          borderRadius="lg"
          onClick={() => goNext()}
        >
          Start
        </Button>
      </Box>
    );
  }

  // -------------------------------------
  // CONTENT CARD RENDERER
  // (UNCHANGED FROM YOUR ORIGINAL)
  // -------------------------------------
  function renderContentCard(card: any) {
    if (!card) return null;

    const metaHeader = (
      <>
        <Text fontSize="xs" fontWeight="700" mb={3}>
          {card.header}
        </Text>

        <Heading fontSize="xl" mb={2}>
          {card.title}
        </Heading>

        <Text color="gray.500" fontSize="sm" mb={4}>
          {card.source} • {card.date}
        </Text>
      </>
    );

    if (card.type === "Tech Bullet Summary") {
      return (
        <Box>
          {metaHeader}

          <Heading fontSize="md" mb={2}>Key Points</Heading>
          {card.bullets.map((b: string, i: number) => (
            <Text mb={2} key={i}>• {b}</Text>
          ))}

          <Flex mt={4} align="center" gap={2}>
            <Text fontWeight="700">Risk Level</Text>
            <Text fontWeight="700" color="red.500">{card.risk}</Text>
          </Flex>
        </Box>
      );
    }

    if (card.type === "Story Mode Summary") {
      return (
        <Box>
          {metaHeader}
          <Text mb={6}>{card.text}</Text>
          {card.image && (
            <Image src={card.image} alt="story" borderRadius="lg" w="100%" />
          )}
        </Box>
      );
    }

    if (card.type === "Deep Structured Brief") {
      return (
        <Box>
          {metaHeader}
          {Object.entries(card.sections).map(([title, txt]: any) => (
            <Box mb={5} key={title}>
              <Heading fontSize="md" mb={1}>{title}</Heading>
              <Text>{txt}</Text>
            </Box>
          ))}
        </Box>
      );
    }

    if (card.type === "Micro Summary") {
      return (
        <Box>
          {metaHeader}
          <Text>{card.summary}</Text>
        </Box>
      );
    }

    if (card.type === "Podcast") {
      return (
        <Box>
          {metaHeader}
          <Text mb={6}>{card.summary}</Text>
          <Box
            p={5}
            border="1px solid #eee"
            borderRadius="xl"
            bg="gray.50"
            textAlign="center"
          >
            <Text fontWeight="600">🎧 Podcast format</Text>
            <Text fontSize="sm">Coming soon</Text>
          </Box>
          {card.image && <Image src={card.image} mt={4} borderRadius="lg" />}
        </Box>
      );
    }

    if (card.type === "Video") {
      return (
        <Box>
          {metaHeader}
          <Text mb={6}>{card.summary}</Text>
          <Box
            p={5}
            border="1px solid #eee"
            borderRadius="xl"
            bg="gray.50"
            textAlign="center"
          >
            <Text fontWeight="600">🎥 Video format</Text>
            <Text fontSize="sm">Coming soon</Text>
          </Box>
          {card.image && <Image src={card.image} mt={4} borderRadius="lg" />}
        </Box>
      );
    }

    return null;
  }

  // -------------------------------------
  // MAIN RENDER
  // -------------------------------------
  return (
    <Flex direction="column" align="center" px={6} py={8} minH="100vh" bg="white">
      <Flex w="100%" maxW="600px" justify="space-between" mb={4}>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>

        <Text fontSize="sm" color="gray.600">
          {website ? website + ".com" : ""}
        </Text>

        <Text fontSize="sm" color="gray.600">
          {Math.min(step + 1, totalSteps)}/{totalSteps}
        </Text>
      </Flex>

      <Progress
        value={progressValue}
        w="100%"
        maxW="600px"
        mb={6}
        size="sm"
        borderRadius="full"
      />

      {isIntro ? (
        renderIntroCard()
      ) : (
        <MotionBox
          bg="white"
          borderRadius="2xl"
          boxShadow="0 12px 30px rgba(0,0,0,0.10)"
          p={7}
          maxW="480px"
          w="100%"
          drag="x"
          style={{ x, rotate, opacity: baseOpacity }}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          cursor="grab"
          position="relative"
        >
          {/* KEEP overlay */}
          <motion.div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              padding: "4px 10px",
              borderRadius: "999px",
              border: "2px solid #16a34a",
              color: "#16a34a",
              fontSize: 12,
              fontWeight: 700,
              opacity: likeOpacity,
            }}
          >
            KEEP
          </motion.div>

          {/* SKIP overlay */}
          <motion.div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              padding: "4px 10px",
              borderRadius: "999px",
              border: "2px solid #dc2626",
              color: "#dc2626",
              fontSize: 12,
              fontWeight: 700,
              opacity: skipOpacity,
            }}
          >
            SKIP
          </motion.div>

          {renderContentCard(currentCard)}
        </MotionBox>
      )}

      {!isIntro && (
        <Flex mt={6} gap={4}>
          <Button variant="outline" borderColor="gray.400" onClick={() => handleButton("skip")}>
            Skip
          </Button>

          <Button
            bg={currentCard?.comingSoon ? "gray.300" : "black"}
            color="white"
            disabled={currentCard?.comingSoon}
            onClick={() => handleButton("like")}
          >
            {currentCard?.comingSoon ? "Coming soon" : "Keep"}
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
