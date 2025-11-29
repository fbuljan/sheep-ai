import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Your Feed</h1>

        <Button
          onClick={handleLogout}
          color="white"
          bg="red.500"
          _hover={{ bg: "red.600" }}
          size="sm"
          borderRadius="lg"
        >
          Logout
        </Button>
      </header>

      {/* content */}
    </div>
  );
}