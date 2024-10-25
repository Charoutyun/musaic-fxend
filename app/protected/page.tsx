import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import './page.css'; 

export default async function ProtectedPage() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/sign-in");
	}

	//Touch this \/ to edit the protected page
	//make it look nicer
	return (
		<div className="page-container">
		  {/* Left Side Mosaic Tiles */}
		  <div className="side-tiles">
			{[...Array(10)].map((_, i) => (
			  <div key={i} className="tile" style={{ '--i': i } as React.CSSProperties}></div>
			))}
		  </div>
	  
		  <div className="page-container">
			{/* Main Content with Home Title */}
			<div className="flex-1 w-full flex flex-col items-center gap-12 main-content">
			<div className="w-full text-center">
				<h1 className="font-bold text-2xl mb-4">Home</h1>
				<h3>Click below to get started</h3>
			</div>

			{/* Side-by-side Music Player and Chatbox */}
			<div className="flex w-full justify-center gap-8">
				{/* Music Player */}
				<div className="flex flex-col gap-2 items-start music-player">
				<h2 className="font-bold text-2xl mb-4">Music Player</h2>
				</div>

				{/* Chatbox */}
				<div className="flex flex-col gap-2 items-start chatbox">
				<h2 className="font-bold text-2xl mb-4">Chatbox</h2>
				</div>
			</div>
			</div>
		</div>
	  
		  {/* Right Side Mosaic Tiles */}
		  <div className="side-tiles">
			{[...Array(10)].map((_, i) => (
			  <div key={i} className="tile" style={{ '--i': i } as React.CSSProperties}></div>
			))}
		  </div>
		</div>
	  );
	  
	  
}
