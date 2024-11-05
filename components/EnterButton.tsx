"use client";

import { useRouter } from "next/navigation";

export default function EnterButton() {
	const router = useRouter();

	const handleClick = () => {
		router.push("/protected/player/");
	};

	return (
		<button className="auth-button" onClick={handleClick}>
			Next
		</button>
	);
}
