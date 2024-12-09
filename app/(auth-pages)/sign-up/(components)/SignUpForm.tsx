import Link from "next/link";
import { HashToSearch } from "@/app/(components)/HashToSearch";

export const SignUpForm = () => {
  return (
    <>
      <HashToSearch />
      <div className="flex flex-col gap-2 min-w-72 max-w-72">
        <div className="flex-1 flex flex-col min-w-64 space-y-2.5">
          <h1 className="text-center">Sign up</h1>
          <div className="flex flex-col gap-2 mt-8">
            <p className="text-center">
              To sign up, please fill out the form below:
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc1iAtvR8LclSbexHsulPTdOkFvq5dBZc7BDBH4xly3BKePTw/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-primary text-black py-2 px-4 rounded hover:bg-primary-dark"
            >
              Go to Sign-Up Form
            </a>
            <small>
              Already have an account?{" "}
              <Link
                className="text-primary font-medium underline"
                href="/sign-in"
              >
                Sign in
              </Link>
            </small>
          </div>
        </div>
      </div>
    </>
  );
};
