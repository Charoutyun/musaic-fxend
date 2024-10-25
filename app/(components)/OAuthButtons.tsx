// components/OAuthButtons.tsx
import { Button } from "@/components/ui/button";
import {
  SiGoogle,
  SiSpotify,
} from "@icons-pack/react-simple-icons";
import {
  signInWithGoogle,
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
      <Button type="submit" className={className}>
        {children}
      </Button>
    </form>
  );
};

export const OAuthButtons = ({ actionType }: { actionType: "signUp" | "signIn" }) => {
  return (
    <>
      <OAuthButton
        formAction={signInWithGoogle}
        className="relative bg-[#4285F4] hover:bg-[#2e61b3] w-full"
      >
        <SiGoogle className="absolute left-2" />
        Sign {actionType === "signIn" ? "in" : "up"} with Google
      </OAuthButton>
      <OAuthButton
        formAction={signInWithSpotify}
        className="relative bg-[#1DB954] hover:bg-[#189a46] w-full"
      >
        <SiSpotify className="absolute left-2" />
        Sign {actionType === "signIn" ? "in" : "up"} with Spotify
      </OAuthButton>
    </>
  );
};
