import { Box, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  navigateTo?: string;
  height?: string;
  absolute?: boolean;
}

export const Logo = ({ navigateTo, height = "48px", absolute = false }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <Box
      position={absolute ? "absolute" : "relative"}
      left={absolute ? { base: -2, md: 0 } : undefined}
      top={absolute ? { base: -4, md: 0 } : undefined}
      cursor={navigateTo ? "pointer" : "default"}
      onClick={navigateTo ? () => navigate(navigateTo) : undefined}
      zIndex={0}
    >
      <Image
        src="/logo.png"
        alt="SIKUM logo"
        height={height}
      />
    </Box>
  );
};
