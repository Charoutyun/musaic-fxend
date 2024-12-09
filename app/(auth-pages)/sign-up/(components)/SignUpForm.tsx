import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FormMessage, Message } from "@/components/form-message";
import { OAuthButtons } from "@/app/(components)/OAuthButtons";
import { HashToSearch } from "@/app/(components)/HashToSearch";

export const SignUpForm = ({ searchParams }: { searchParams: Message }) => {
	return (
		<>
			<HashToSearch />
			<div className="flex flex-col gap-2 min-w-72 max-w-72">
				<form className="flex-1 flex flex-col min-w-64 space-y-2.5">
					<h1 className="text-center">Sign up</h1>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
						<Label htmlFor="email"></Label>
						<Input name="email" placeholder="Email" required />
						<Label htmlFor="password"></Label>
						<Input
							type="password"
							name="password"
							placeholder="Password"
							minLength={6}
							required
						/>
						<SubmitButton formAction={signUpAction} pendingText="Signing up...">
							Sign up
						</SubmitButton>
						<small>
							Already have an account?{" "}
							<Link
								className="text-primary font-medium underline"
								href="/sign-in">Sign in
							</Link>
						</small>
						<FormMessage message={searchParams} />
					</div>
				</form>
				<Separator className="w-full mb-2" />
				<div className="flex flex-col justify-start items-stretch space-y-2">
					<OAuthButtons actionType="signUp"></OAuthButtons>
				</div>
			</div>
		</>
	);
};
