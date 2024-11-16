import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import Musaic from "/public/musaic.png"; // Adjust path if necessary

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Musaic",
	description: "An intelligent music recommendation system",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={GeistSans.className} suppressHydrationWarning>
			<body className="bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main className="min-h-screen flex flex-col items-center">
						<div className="flex-1 w-full flex flex-col gap-20 items-center">
							<div className="w-full flex justify-center border-b border-b-foreground/10 h-16">
								<header className="w-full max-w-5xl px-4 lg:px-6 h-14 flex items-center justify-between">
									<Link
										className="flex flex-row items-center space-x-1 font-semibold"
										href="/"
									>
										<Image
											src={Musaic}
											alt="Musaic Logo"
											className="h-9 w-9"
										/>
										<span className="align-middle text-2xl">Musaic</span>
									</Link>
									<nav className="ml-auto flex gap-4 sm:gap-6 float-end">
										<Link
											className="text-sm font-medium hover:underline underline-offset-4"
											href="#"
										>
											Features
										</Link>
										<Link
											className="text-sm font-medium hover:underline underline-offset-4"
											href="#"
										>
											About
										</Link>
									</nav>

									<div className="ml-4">
										<HeaderAuth />
									</div>
								</header>
							</div>
							<div className="flex flex-col gap-20 max-w-5xl p-5">
								{children}
							</div>

							<footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
								<p>
									Powered by{" "}
									<a
										href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
										target="_blank"
										className="font-bold hover:underline"
										rel="noreferrer"
									>
										Supabase
									</a>
								</p>
								<ThemeSwitcher />
							</footer>
						</div>
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}