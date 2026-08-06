import type { ComponentProps } from "react";
import spotifyIcon from "@/assets/icons/spotify-icon.svg";
import { Button } from "@/components/common/button";

type SpotifyButtonProps = Omit<ComponentProps<typeof Button>, "leadingIcon" | "variant">;

export function SpotifyButton({ children, ...props }: SpotifyButtonProps) {
  return (
    <Button
      {...props}
      leadingIcon={<img src={spotifyIcon} width="20" height="20" alt="" />}
      variant="spotify"
    >
      {children}
    </Button>
  );
}
