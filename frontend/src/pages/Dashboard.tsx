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
  DrawerFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Load websites from user's preferredWebsites
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.preferredWebsites && Array.isArray(user.preferredWebsites)) {
          setWebsites(user.preferredWebsites);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  function addWebsite() {
    navigate("/categories", { state: { website: "" } });
  }

  function openWebsite(domain: string) {
    const prefs = JSON.parse(
      localStorage.getItem("websitePreferences") || "{}"
    );

    navigate("/swipe", {
      state: {
        website: domain,
        categories: prefs[domain]?.categories || [],
      },
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
        <Heading fontWeight="600" fontSize="2xl">
          Dashboard
        </Heading>

        {/* Hamburger menu */}
        <IconButton
          aria-label="Menu"
          icon={<HamburgerIcon boxSize={6} />}
          variant="ghost"
          onClick={onOpen}
        />
      </Flex>

      {/* TITLE */}
      <Heading fontSize="3xl" mb={3}>
        Your Websites
      </Heading>

      <Text color="gray.600" mb={10} textAlign="center">
        Click a website to explore your personalized brief.
      </Text>

      {/* ADD BUTTON */}
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

      {/* WEBSITE GRID */}
      {websites.length === 0 ? (
        <Text color="gray.500" fontSize="lg" mt={10}>
          You haven't added any websites yet.
        </Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
          w="100%"
          maxW="1000px"
        >
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
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
              }}
              onClick={() => openWebsite(domain)}
            >
              {domain}
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* SLIDE-IN MENU */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxW="200px"> 
        <DrawerHeader fontSize="xl" fontWeight="600">
          Menu
        </DrawerHeader>

        <DrawerBody display="flex" flexDirection="column" gap="20px">
          <Button
            variant="ghost"
            w="full"
            justifyContent="flex-start"
            onClick={() => {
              onClose();
              navigate("/settings");
            }}
          >
            Settings
          </Button>

          <Button
            variant="ghost"
            w="full"
            justifyContent="flex-start"
            onClick={logout}
            color="red.500"
          >
            Logout
          </Button>
        </DrawerBody>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>

    </Flex>
  );
}