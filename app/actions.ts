// actions.ts
"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin") || '';

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(`${error.code} ${error.message}`);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();

  if (!email || !password) {
    return encodedRedirect("error", "/sign-in", "Email and password are required");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(`Sign-in error: ${error.message}`);
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const signInOAuthAction = async (provider: string) => {
  const supabase = createClient();
  const origin = headers().get("origin") || '';

  const isSpotify = provider === "spotify";
  const scopes = isSpotify
    ? [
        "user-read-email",
        "user-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming",
      ]
    : [];

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected`,
	  scopes: scopes.join(' '),
    },
  });

  if (error) {
    console.error(`OAuth sign-in error: ${error.message}`);
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Redirect the client to the OAuth provider's URL
  return redirect(data.url);
};

export const signInWithDiscord = async () => {
  await signInOAuthAction("discord");
};

export const signInWithGoogle = async () => {
  await signInOAuthAction("google");
};

export const signInWithGithub = async () => {
  await signInOAuthAction("github");
};

export const signInWithSpotify = async () => {
  await signInOAuthAction("spotify");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin") || '';
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(`Password reset error: ${error.message}`);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error(`Password update error: ${error.message}`);
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
