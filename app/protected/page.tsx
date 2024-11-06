import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnterButton from "@/components/EnterButton";

export default async function ProtectedPage() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    //Div elements and UI of /protected/
    return (
        <div className="page-container">
            {/* Left mosaic */}
            <div className="side-tiles left">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="tile" style={{ "--i": i } as React.CSSProperties}></div>
                ))}
            </div>

            {/* Authentication */}
            <div className="auth-card">
                <h1 className="auth-head">Welcome, {user.email}!</h1>
                <p className="auth-msg">Your account has been successfully authenticated.</p>
                <p className="auth-click">
                    Click below to access the music player and chatroom.
                </p>
                <EnterButton /> 
            </div>

            {/* Right mosaic */}
            <div className="side-tiles right">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="tile" style={{ "--i": i } as React.CSSProperties}></div>
                ))}
            </div>

            <style jsx>{`
                .page-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f0f0f0;
                    position: relative;
                }

                .side-tiles {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .left {
                    position: absolute;
                    left: 0;
                    transform: translateX(calc(var(--i) * 10px));
                }

                .right {
                    position: absolute;
                    right: 0;
                    transform: translateX(calc(var(--i) * -10px));
                }

                .tile {
                    width: 30px;
                    height: 30px;
                    background-color: #ccc;
                }

                .auth-card {
                    background-color: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .auth-head {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }

                .auth-msg {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }

                .auth-click {
                    margin-top: 1rem;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
}
