import { Box, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  navigateTo?: string;
  height?: string;
}

export const Logo = ({ navigateTo, height = "200px" }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <Box
      overflow="hidden"
      height={`calc(${height} * 0.65)`}
      cursor={navigateTo ? "pointer" : "default"}
      onClick={navigateTo ? () => navigate(navigateTo) : undefined}
    >
      <Image
        src="/logo.jpeg"
        alt="SIKUM logo"
        height={height}
        marginTop={`calc(${height} * -0.35)`}
      />
    </Box>
  );
};
