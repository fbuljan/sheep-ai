import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [websites, setWebsites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !user.id) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/users/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWebsites(res.data.preferredWebsites || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  function addWebsite() {
    navigate("/add-website");
  }

  function openWebsite(domain: string) {
    navigate("/swipe", {
      state: { website: domain },
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex bg="white" minH="100vh" direction="column" px={{ base: 6, md: 16 }} py={10} align="center">
      {/* HEADER */}
      <Flex w="100%" justify="space-between" align="center" mb={12}>
        <Heading fontWeight="600" fontSize="2xl">
          Dashboard
        </Heading>

        <IconButton aria-label="Menu" icon={<HamburgerIcon boxSize={6} />} variant="ghost" onClick={onOpen} />
      </Flex>

      {/* Title */}
      <Heading fontSize="3xl" mb={3}>
        Your Websites
      </Heading>

      <Text color="gray.600" mb={10} textAlign="center">
        Click a website to explore your personalized brief.
      </Text>

      {/* Add button */}
      <Button
        bg="black"
        color="white"
        px={8}
        py={5}
        borderRadius="lg"
        mb={10}
        _hover={{ bg: "gray.800" }}
        onClick={addWebsite}
      >
        + Add New Website
      </Button>

      {/* Website grid */}
      {websites.length === 0 ? (
        <Text color="gray.500" fontSize="lg" mt={10}>
          You haven't added any websites yet.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="100%" maxW="1000px">
          {websites.map((domain) => (
            <Box
              key={domain}
              border="1px solid #E5E5E5"
              borderRadius="lg"
              p={8}
              bg="white"
              cursor="pointer"
              transition="0.2s"
              textAlign="center"
              fontWeight="600"
              fontSize="lg"
              boxShadow="0 4px 8px rgba(0,0,0,0.05)"
              _hover={{ transform: "translateY(-4px)", boxShadow: "0 6px 12px rgba(0,0,0,0.08)" }}
              onClick={() => openWebsite(domain)}
            >
              {domain}
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Menu drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="200px">
          <DrawerHeader fontSize="xl" fontWeight="600">Menu</DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" gap="20px">
            <Button variant="ghost" w="full" justifyContent="flex-start" onClick={() => { onClose(); navigate("/settings"); }}>
              Settings
            </Button>

            <Button variant="ghost" w="full" justifyContent="flex-start" onClick={logout} color="red.500">
              Logout
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}