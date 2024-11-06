import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import EnterButton from "@/components/EnterButton";
import './page.css'; 

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
           

            {/* Authentication */}
            <div className="auth-card">
                <h1 className="auth-head">Welcome, {user.email}!</h1>
                <p className="auth-msg">Your account has been successfully authenticated.</p>
                <p className="auth-click">
                    Click below to access the music player and chatroom.
                </p>
                <EnterButton /> 
            </div>

           
        </div>
    );
}