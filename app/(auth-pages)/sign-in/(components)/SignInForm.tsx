import { HashToSearch } from "@/app/(components)/HashToSearch";
import { OAuthButtons } from "@/app/(components)/OAuthButtons";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";

//working on signin
export const LogInForm = ({ searchParams }: { searchParams: Message }) => {
	return (
		<>
			<HashToSearch />
			<div className="flex flex-col gap-2 min-w-72 max-w-72">
				<form className="flex-1 flex flex-col min-w-64 space-y-2.5">
					<h1>Sign in</h1>
					<small>
						Don't have an account?{" "}
						<Link
							className="text-foreground font-medium underline"
							href="/sign-up"
						>
							Sign up
						</Link>
					</small>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
						<Label htmlFor="email">Email</Label>
						<Input name="email" placeholder="hello@example.com" required />
						<div className="flex justify-between items-center">
							<Label htmlFor="password">Password</Label>
							<Link
								className="text-xs text-foreground underline"
								href="/forgot-password"
							>
								Forgot Password?
							</Link>
						</div>
						<Input
							type="password"
							name="password"
							placeholder="Your password"
							required
						/>
						<SubmitButton pendingText="Signing In..." formAction={signInAction}>
							Sign in
						</SubmitButton>
						<FormMessage message={searchParams} />
					</div>
				</form>
				<Separator className="w-full mb-2" />
				<div className="flex flex-col justify-start items-stretch space-y-2">
					<OAuthButtons actionType="signIn"></OAuthButtons>
				</div>
			</div>
		</>
	);
};
