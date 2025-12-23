import { useState } from "react";
import { Camera, Edit, Mail, School, Star, Calendar } from "lucide-react";

// -------------------------------
// Profile Type
// -------------------------------
interface ProfileData {
    name: string;
    email: string;
    university: string;
    bio: string;
    interests: string[];
}

const ProfilePage: React.FC = () => {
    const [editing, setEditing] = useState<boolean>(false);

    const [profile, setProfile] = useState<ProfileData>({
        name: "Prashant Panchal",
        email: "prashant@example.com",
        university: "XYZ University",
        bio: "Passionate learner who loves collaborating and helping others grow.",
        interests: ["React", "Node.js", "Data Structures", "MongoDB"],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-5">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">

                {/* ----------------------------- */}
                {/* Profile Header */}
                {/* ----------------------------- */}
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

                    <h2 className="mt-4 text-3xl font-semibold">{profile.name}</h2>

                    <p className="text-gray-600 flex items-center gap-2">
                        <Mail size={18} /> {profile.email}
                    </p>

                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <School size={18} /> {profile.university}
                    </p>

                    <button
                        onClick={() => setEditing(!editing)}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <Edit size={18} /> {editing ? "Save" : "Edit Profile"}
                    </button>
                </div>

                <hr className="my-6" />

                {/* ----------------------------- */}
                {/* About Me Section */}
                {/* ----------------------------- */}
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

                <hr className="my-6" />

                {/* ----------------------------- */}
                {/* Skills & Interests */}
                {/* ----------------------------- */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Skills & Interests</h3>

                    <div className="flex flex-wrap gap-3">
                        {profile.interests.map((item, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-full"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <hr className="my-6" />

                {/* ----------------------------- */}
                {/* Availability */}
                {/* ----------------------------- */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Calendar size={20} /> Weekly Availability
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <div
                                key={day}
                                className="border rounded-lg p-3 text-center shadow-sm bg-gray-50"
                            >
                                <p className="font-semibold">{day}</p>
                                <p className="text-gray-600 text-sm">5pm - 8pm</p>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="my-6" />

                {/* ----------------------------- */}
                {/* Saved Groups */}
                {/* ----------------------------- */}
                <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <Star size={20} /> Saved Groups
                    </h3>

                    <div className="space-y-3">
                        {["DSA Study Group", "React Learners Hub", "Node.js Weekly"].map(
                            (group) => (
                                <div
                                    key={group}
                                    className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 cursor-pointer"
                                >
                                    {group}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
