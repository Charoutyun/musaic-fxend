import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HashToSearch } from "@/app/(components)/HashToSearch";

export const ForgotPasswordForm = ({
	searchParams,
}: {
	searchParams: Message;
}) => {
	return (
		<>
			<HashToSearch />
			<form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-96 max-w-96 mx-auto">
				<div>
					<h1 className="">Reset Password</h1>
				</div>
				<div className="flex flex-col gap-2 [&>input]:mb-3 mt-0">
					<Label htmlFor="email"></Label>
					<Input name="email" placeholder="Email" required />
					<div className="flex flex-row space-x-2 justify-end">
						<Link
							className={buttonVariants({ variant: "default" })}
							href="/sign-in"
						>
							Back
						</Link>
						<SubmitButton
							formAction={forgotPasswordAction}
							className={buttonVariants({ variant: "destructive" })}
						>
							Reset Password
						</SubmitButton>
					</div>
					<FormMessage message={searchParams} />
				</div>
			</form>
		</>
	);
};
