// components/OAuthButtons.tsx
import { Button } from "@/components/ui/button";
import {
  SiSpotify,
} from "@icons-pack/react-simple-icons";
import {
  signInWithSpotify,
} from "@/app/actions";

type OAuthButtonProps = {
  formAction: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
};

const OAuthButton = ({ formAction, children, className }: OAuthButtonProps) => {
  return (
    <form action={formAction}>
      <Button type="submit" className={`flex items-center justify-center ${className}`}>
        <SiSpotify className="mr-2" /> {/* Single Spotify logo with spacing */}
        {children}
      </Button>
    </form>
  );
};

export const OAuthButtons = ({ actionType }: { actionType: "signUp" | "signIn" }) => {
  return (
    <>
      <OAuthButton
        formAction={signInWithSpotify}
        className="relative bg-[#1DB954] hover:bg-[#189a46] w-full"
      >
        Sign {actionType === "signIn" ? "in" : "up"} with Spotify
      </OAuthButton>
    </>
  );
};
