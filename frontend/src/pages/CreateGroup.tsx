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
        <section className="text-gray-700 body-font">
            <div className="container mx-auto px-5 py-16">
                {/* Responsive Layout */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* LEFT: Create Group Form */}
                    <div className="md:w-1/3 w-full">
                        <CreateGroupForm />
                    </div>

                    {/* RIGHT: Created Groups */}
                    <div className="md:w-2/3 w-full">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Created Groups
                        </h1>

                        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
                            {groupc.map((group) => (
                                <div
                                    key={group._id}
                                    className="relative p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
                                >
                                    <button
                                        onClick={() => handleDelete(group._id)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>

                                    <h2 className="text-xl font-semibold mb-2">
                                        {group.topic} — {group.subtopic}
                                    </h2>

                                    <div className="flex items-center gap-2 text-gray-500 mb-3">
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="text-sm italic">
                                            {group.desc}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                                        <Clock className="w-5 h-5" />
                                        <span>
                                            Time: {group.time} — {group.days} days
                                        </span>
                                    </div>

                                    <div className="mb-5">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Group Activity
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{ width: `50%` }}
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
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
