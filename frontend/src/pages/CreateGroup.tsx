import { MessageSquare, Clock, Trash } from "lucide-react";
import CreateGroupForm from "../componets/CreateGroupForm";
import groupContext from "../context/groups/groupContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateGroups: React.FC = () => {
    const groupCtx = useContext(groupContext);
    const [groupc, setGroups] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!groupCtx) return;

        if (!localStorage.getItem('token')) {
            navigate("/login");
            return;
        }

        const fetchGroups = async () => {
            try {
                const data = await groupCtx.getGroups();
                setGroups(data || []);
            } catch (err) {
                console.error("Failed fetching groups", err);
            }
        };

        fetchGroups();
    }, [groupCtx]);

    const handleDelete = async (id: string) => {
        if (!groupCtx) return;

        try {
            await groupCtx.deleteGroup(id);
            setGroups((prev) => prev.filter((g) => g._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <section className="bg-gray-100 md:h-screen md:overflow-hidden">
            <div className="h-full container mx-auto px-4 py-6">

                {/* MAIN WRAPPER */}
                <div className="h-full flex flex-col md:flex-row gap-20 mx-10">

                    {/* LEFT — FORM (NO SCROLL) */}
                    <div className="md:w-1/2 w-full bg-white rounded-xl shadow p-6">
                        <CreateGroupForm />
                    </div>

                    {/* RIGHT — GROUP LIST (SCROLL ONLY HERE) */}
                    <div className="md:w-1/2 w-full flex flex-col bg-white rounded-xl shadow p-6">

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Created Groups
                        </h1>

                        {/* SCROLLABLE LIST */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                            {groupc.map((group) => (
                                <div
                                    key={group._id}
                                    className="relative p-5 bg-gray-50 rounded-xl shadow hover:shadow-md transition flex flex-col"
                                >
                                    <button
                                        onClick={() => handleDelete(group._id)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>

                                    <h2 className="text-lg font-semibold mb-2">
                                        {group.topic} — {group.subtopic}
                                    </h2>

                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-sm italic">
                                            {group.desc}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">
                                            {group.time} • {group.days} days
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Group Activity
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{ width: "50%" }}
                                            />
                                        </div>
                                    </div>

                                    <button className="mt-auto bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                                        Open Group
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default CreateGroups;
