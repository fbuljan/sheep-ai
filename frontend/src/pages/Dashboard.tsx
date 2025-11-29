import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [websites, setWebsites] = useState<string[]>([]);
  const [newWebsite, setNewWebsite] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function addWebsite() {
    if (!newWebsite.trim()) return;

    setWebsites([...websites, newWebsite.trim()]);
    toast({
      title: "Website added",
      description: `${newWebsite} added to your sources.`,
      status: "success",
      duration: 2000,
    });

    onClose();

    navigate("/swipe", {
      state: { website: newWebsite.trim() },
    });

    setNewWebsite("");
  }

  return (
    <Flex
      bg="white"
      minH="100vh"
      direction="column"
      px={{ base: 6, md: 16 }}
      py={10}
    >
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={12}>
        <Heading fontWeight="600" fontSize="2xl">
          Dashboard
        </Heading>

        <Button
          variant="ghost"
          fontSize="sm"
          color="gray.600"
          _hover={{ color: "black" }}
          onClick={handleLogout}
          px={2}
        >
          Log out
        </Button>
      </Flex>

      {/* INTRO */}
      <Box mb={10}>
        <Heading fontSize="3xl" fontWeight="700" mb={2}>
          Your Personalized Sources
        </Heading>
        <Text color="gray.600" maxW="600px" fontSize="lg">
          Add your cybersecurity or news sources. We'll prepare your daily brief automatically.
        </Text>
      </Box>

      {/* EMPTY STATE */}
      {websites.length === 0 && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={20}
          border="2px dashed #E5E5E5"
          borderRadius="lg"
          mb={12}
        >
          <Text fontSize="lg" color="gray.600" mb={4}>
            You haven’t added any websites yet.
          </Text>

          <Button
            bg="black"
            color="white"
            px={8}
            py={6}
            borderRadius="lg"
            onClick={onOpen}
            _hover={{ bg: "gray.800" }}
          >
            + Add your first website
          </Button>
        </Flex>
      )}

      {/* WEBSITE GRID */}
      {websites.length > 0 && (
        <>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6} mb={16}>
            {websites.map((site, idx) => (
              <Box
                key={idx}
                borderRadius="lg"
                border="1px solid #E5E5E5"
                p={4}
                textAlign="center"
                cursor="pointer"
                transition="0.2s"
                bg="white"
                _hover={{
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                }}
                onClick={() =>
                  navigate("/swipe", { state: { website: site } })
                }
              >
                <Heading size="sm" mb={1}>
                  {site}
                </Heading>
                <Text color="gray.500" fontSize="xs">
                  Tap to refine
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Add button only when user ALREADY has sites */}
          <Flex justify="center" mt={16}>
            <Button
              bg="black"
              color="white"
              px={8}
              py={6}
              borderRadius="lg"
              onClick={onOpen}
              _hover={{ bg: "gray.800" }}
            >
              + Add website
            </Button>
          </Flex>
        </>
      )}

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" p={2}>
          <ModalHeader>Add a website</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="example.com"
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              borderRadius="lg"
              border="2px solid #E5E5E5"
              p={6}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>

            <Button
              bg="black"
              color="white"
              borderRadius="lg"
              px={6}
              _hover={{ bg: "gray.900" }}
              onClick={addWebsite}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}