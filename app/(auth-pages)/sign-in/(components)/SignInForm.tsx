import { HashToSearch } from "@/app/(components)/HashToSearch";
import { OAuthButtons } from "@/app/(components)/OAuthButtons";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";

export const LogInForm = ({ searchParams }: { searchParams: Message }) => {
	return (
		<>
			<HashToSearch />
			<div className="flex flex-col gap-2 min-w-72 max-w-72">
				<form className="flex-1 flex flex-col min-w-64 space-y-2.5">
					<h1 className="text-center">Sign in</h1>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
						<Label
							htmlFor="email">
						</Label>
						<Input
							name="email"
							placeholder="Email"
							required
						/>
						<div className="flex justify-between items-center">
							<Label 
							htmlFor="password">
							</Label>
						</div>
						<Input
							type="password"
							name="password"
							placeholder="Password"
							required
						/>

						<Link
							className="text-xs text-foreground underline"
							href="/forgot-password"
						>
							Forgot Password?
						</Link>

						<SubmitButton pendingText="Signing In..." formAction={signInAction} >
							Sign in
						</SubmitButton>
						<small>
							Don't have an account?{" "}
							<Link
								className="text-primary font-medium underline"
								href="/sign-up"
							>
								Sign up
							</Link>
						</small>
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
