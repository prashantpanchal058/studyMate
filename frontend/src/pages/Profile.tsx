import { useState, useEffect } from "react";
import { Camera, Edit, Mail, School } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
    name: string;
    email: string;
    university: string;
    bio: string;
}

const ProfilePage: React.FC = () => {
    const [editing, setEditing] = useState<boolean>(false);
    const [profile, setProfile] = useState<ProfileData>({
        name: "",
        email: "",
        university: "XYZ University",
        bio: "Passionate learner who loves collaborating and helping others grow."
    });

    const navigate = useNavigate();

    // ✅ Single source of truth
    const token = localStorage.getItem("token");

    const isLoggedIn = !!token;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login"); // ✅ redirect after logout
    };

    // ✅ Fetch user only if token exists
    useEffect(() => {
        if (!token) return;

        const getUser = async () => {
            try {
                // const response = await fetch("http://localhost:8007/getuser", {
                const response = await fetch("https://studymate-p7sk.onrender.com/getuser", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    }
                });

                const json = await response.json();
                console.log(json)
                // ✅ Handle invalid token
                if (!response.ok) {
                    console.error("Auth error:", json);
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                // ✅ Update profile properly
                setProfile((prev) => ({
                    ...prev,
                    name: json?.name || "",
                    email: json?.email || ""
                }));

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        getUser();
    }, [token, navigate]);

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gray-50 p-5">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">

                {/* AUTH BUTTONS */}
                <div className="flex justify-end gap-3 mb-4">
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => navigate("/Signup")}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Signup
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Profile Header */}
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img
                            src="https://i.pravatar.cc/120"
                            alt="avatar"
                            className="w-28 h-28 rounded-full shadow-md object-cover"
                        />
                        <button className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full text-white shadow hover:bg-indigo-700">
                            <Camera size={16} />
                        </button>
                    </div>

                    <h2 className="mt-4 text-3xl font-semibold">
                        {profile.name || "Guest User"}
                    </h2>

                    <p className="text-gray-600 flex items-center gap-2">
                        <Mail size={18} /> {profile.email || "Not available"}
                    </p>

                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <School size={18} /> {profile.university}
                    </p>

                    {isLoggedIn && (
                        <button
                            onClick={() => setEditing(!editing)}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <Edit size={18} /> {editing ? "Save" : "Edit Profile"}
                        </button>
                    )}
                </div>

                <hr className="my-6" />

                {/* About Me */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">About Me</h3>

                    {editing ? (
                        <textarea
                            name="bio"
                            className="w-full border p-3 rounded-lg"
                            rows={3}
                            value={profile.bio}
                            onChange={handleChange}
                        />
                    ) : (
                        <p className="text-gray-700">{profile.bio}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;