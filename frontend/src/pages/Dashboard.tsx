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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // locally simulate websites (for now)
  const [websites, setWebsites] = useState<string[]>([]);

  const [newWebsite, setNewWebsite] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function addWebsite() {
    if (!newWebsite.trim()) return;

    setWebsites([...websites, newWebsite.trim()]);
    toast({
      title: "Website added",
      description: `${newWebsite} added to your sources.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    onClose();

    // move user to swipe screen for this new site
    navigate("/swipe", {
      state: { website: newWebsite.trim() },
    });

    setNewWebsite("");
  }

  return (
    <Flex minH="100vh" bg="#0B0F1A" color="white" p={8} direction="column">
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Your Dashboard</Heading>

        <Button
          onClick={handleLogout}
          size="sm"
          bg="red.500"
          _hover={{ bg: "red.600" }}
        >
          Logout
        </Button>
      </Flex>

      {/* SECTION TITLE */}
      <Heading size="md" mb={4}>
        Your Websites
      </Heading>

      {/* EMPTY STATE */}
      {websites.length === 0 ? (
        <Box
          bg="whiteAlpha.100"
          p={6}
          borderRadius="xl"
          border="1px solid rgba(255,255,255,0.1)"
          textAlign="center"
        >
          <Text color="gray.400" mb={4}>
            You haven't added any websites yet.
          </Text>

          <Button
            onClick={onOpen}
            bg="purple.500"
            _hover={{ bg: "purple.600" }}
          >
            Add your first website
          </Button>
        </Box>
      ) : (
        <>
          {/* LIST OF WEBSITES */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {websites.map((site, idx) => (
              <Box
                key={idx}
                bg="whiteAlpha.100"
                p={4}
                borderRadius="xl"
                border="1px solid rgba(255,255,255,0.1)"
              >
                <Text fontSize="lg">{site}</Text>

                <Button
                  mt={4}
                  size="sm"
                  bgGradient="linear(to-r, purple.500, indigo.600)"
                  onClick={() =>
                    navigate("/swipe", { state: { website: site } })
                  }
                >
                  Open Swipe
                </Button>
              </Box>
            ))}
          </SimpleGrid>

          <Button
            mt={6}
            onClick={onOpen}
            w="200px"
            bg="purple.500"
            _hover={{ bg: "purple.600" }}
          >
            Add website
          </Button>
        </>
      )}

      {/* ADD WEBSITE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#111827" color="white">
          <ModalHeader>Add a Website</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="example.com"
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              bg="whiteAlpha.100"
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>

            <Button
              bg="purple.500"
              _hover={{ bg: "purple.600" }}
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