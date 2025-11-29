import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  Progress,
  Image,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";

const MotionBox = motion(Box);

export default function Swipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const website: string | undefined = location.state?.website;

  // ----- HARD-CODED CARDS -----
  const contentCards = [
  // 1) Tech Bullet
    {
      id: "tech-bullet",
      type: "Tech Bullet Summary",
      header: "TECH BULLET SUMMARY",
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      bullets: [
        "Guest access uses the host tenant’s security policies.",
        "Defender protections from the user’s home org do not follow them.",
        "Attackers can create malicious tenants cheaply.",
        "Guest invites bypass email authentication checks.",
        "Malware/phishing links delivered without detection."
      ],
      risk: "High"
    },

    // 2) Story Mode
    {
      id: "story-mode",
      type: "Story Mode Summary",
      header: "STORY MODE SUMMARY",
      title: "Imagine stepping into someone else’s digital workspace.",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      text:
        "The moment you do, your company’s security stays behind. If the workspace belongs to an attacker, they can send harmful links or files—and your company won’t see a thing.",
      image: "/story.png"  
    },

    // 3) Deep Structured Brief
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
          "Malware or phishing can be delivered undetected because it happens outside the org’s security boundary."
      }
    },

    // 4) Micro Summary
    {
      id: "micro-summary",
      type: "Micro Summary",
      header: "MICRO SUMMARY",
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      summary:
        "Teams guest access lets attackers place users inside external tenants where protections do not apply."
    },

    // 5) Podcast (coming soon)
    {
      id: "podcast",
      type: "Podcast",
      header: "PODCAST",
      comingSoon: true,
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      summary:
        "In today’s briefing: researchers found a gap in Teams guest access attackers can abuse.",
      image: "/podcast.png"  
    },

    // 6) VIDEO (coming soon)
    {
      id: "video",
      type: "Video",
      header: "VIDEO",
      comingSoon: true,
      title: "Microsoft Teams Guest Access Security Gap",
      source: "hackernews.com",
      date: "Nov 28, 2025",
      summary:
        "Watch a short video presentation of the key points.",
      image: "/video.png" 
    }
  ];


  // intro + content cards = steps
  const totalSteps = 1 + contentCards.length; // 0 = intro, 1..n = cards

  const [step, setStep] = useState(0); // 0 = intro
  const [liked, setLiked] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const baseOpacity = useTransform(x, [-200, 0, 200], [0.4, 1, 0.4]);

  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const skipOpacity = useTransform(x, [-140, -40], [1, 0]);

  const isIntro = step === 0;
  const currentCard = step > 0 ? contentCards[step - 1] : null;

  function goNext(decision?: "like" | "skip") {
    if (isIntro) {
      setStep(1);
      return;
    }

    if (currentCard && decision) {
      if (decision === "like") {
        setLiked((prev) => [...prev, currentCard.id]);
      } else {
        setSkipped((prev) => [...prev, currentCard.id]);
      }
    }

    if (step >= totalSteps - 1) {
      // kraj swipanja, možemo ovdje kasnije spremati preferencije na backend
      navigate("/dashboard");
      return;
    }

    setStep((prev) => prev + 1);
    x.set(0);
  }

  function handleDragEnd(_: any, info: { offset: { x: number } }) {
    if (isIntro) {
      x.set(0);
      return;
    }

    const offsetX = info.offset.x;
    if (offsetX > 120) {
      goNext("like");
    } else if (offsetX < -120) {
      goNext("skip");
    } else {
      x.set(0);
    }
  }

  function handleButton(decision: "like" | "skip") {
    // ako je podcast i "like" → zabranjeno
    if (currentCard?.comingSoon && decision === "like") return;
    goNext(decision);
  }

  // progress: intro = 0%, zadnja kartica = 100%
  const progressValue =
    step === 0 ? 0 : ((step) / (totalSteps - 1)) * 100;

  // ---------- RENDERI KARTICA ----------

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
        <Text mb={2}>• Podcast & Video formats → <b>coming soon</b></Text>
      </Box>

      <Button
        w="100%"
        bg="black"
        color="white"
        borderRadius="lg"
        py={6}
        _hover={{ bg: "gray.800" }}
        onClick={() => goNext()}
      >
        Start
      </Button>
    </Box>
  );
}


  function renderContentCard(card: any) {
    if (!card) return null;

    // zajednički header (label + title + meta)
    const metaHeader = (
      <>
        <Text fontSize="xs" fontWeight="700" mb={3}>
          {card.header}
        </Text>

        {card.title && (
          <Heading fontSize="xl" mb={2}>
            {card.title}
          </Heading>
        )}

        {card.source && card.date && (
          <Text color="gray.500" fontSize="sm" mb={4}>
            {card.source} • {card.date}
          </Text>
        )}
      </>
    );

    // svaki format posebno
    if (card.type === "Tech Bullet Summary") {
      return (
        <Box>
          {metaHeader}

          <Heading fontSize="md" mb={2}>
            Key Points
          </Heading>
          {card.bullets.map((b: string, idx: number) => (
            <Text key={idx} mb={2}>
              • {b}
            </Text>
          ))}

          <Flex mt={4} align="center" gap={2}>
            <Text fontWeight="700">Risk Level</Text>
            <Text fontWeight="700" color="red.500">
              {card.risk}
            </Text>
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
            <Image
              src={card.image}
              alt="story illustration"
              borderRadius="lg"
              w="100%"
              objectFit="cover"
            />
          )}
        </Box>
      );
    }

    if (card.type === "Deep Structured Brief") {
      return (
        <Box>
          {metaHeader}

          {Object.entries(card.sections).map(([sectionTitle, body]: any) => (
            <Box key={sectionTitle} mb={5}>
              <Heading fontSize="md" mb={1}>
                {sectionTitle}
              </Heading>
              <Text>{body}</Text>
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
          <Text mb={6}>
            In today’s briefing: researchers found a gap in Microsoft Teams guest access that can be abused by attackers.
          </Text>

          <Box
            mt={2}
            p={5}
            borderRadius="xl"
            border="1px solid #eee"
            bg="gray.50"
            textAlign="center"
          >
            <Text mb={2} fontWeight="600">
              🎧 Podcast format
            </Text>
            <Text fontSize="sm" color="gray.600">
              Coming soon. You can only skip this card for now.
            </Text>
          </Box>
          {card.image && (
            <Image
              src={card.image}
              alt="story illustration"
              borderRadius="lg"
              w="100%"
              objectFit="cover"
            />
          )}
        </Box>
      );
    }

    if (card.type === "Video") {
      return (
        <Box>
          {metaHeader}

          <Text mb={6}>{card.summary}</Text>

          <Box
            mt={2}
            p={5}
            borderRadius="xl"
            border="1px solid #eee"
            bg="gray.50"
            textAlign="center"
          >
            <Text mb={2} fontWeight="600">🎥 Video format</Text>
            <Text fontSize="sm" color="gray.600">
              Coming soon. You can only skip this card for now.
            </Text>
          </Box>

          {card.image && (
            <Image
              src={card.image}
              alt="video-placeholder"
              borderRadius="lg"
              w="100%"
              mt={4}
            />
          )}
        </Box>
      );
    }

    return null;
  }

  // ---------- RENDER ----------

  return (
    <Flex direction="column" align="center" px={6} py={8} minH="100vh" bg="white">
      {/* Top bar */}
      <Flex w="100%" maxW="600px" justify="space-between" mb={4} align="center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>

        <Text fontSize="sm" color="gray.600">
          {website ? website + ".com" : "Your source"}
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

      {/* CARD AREA */}
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
          style={{ x, rotate, opacity: baseOpacity }}
          drag="x"
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

      {/* BUTTONS */}
      {!isIntro && (
        <Flex mt={6} gap={4}>
          <Button
            variant="outline"
            borderColor="gray.400"
            onClick={() => handleButton("skip")}
          >
            Skip
          </Button>

          <Button
            bg={currentCard?.comingSoon ? "gray.300" : "black"}
            color="white"
            _hover={currentCard?.comingSoon ? undefined : { bg: "gray.800" }}
            onClick={() => handleButton("like")}
            disabled={!!currentCard?.comingSoon}
          >
            {currentCard?.comingSoon ? "Coming soon" : "Keep"}
          </Button>
        </Flex>
      )}
    </Flex>
  );
}