import { useContext, useEffect, useState } from "react";
import AutoCompleteInput from "./AutoCompleteInput";
import groupContext from "../context/groups/groupContext";
import { useNavigate } from "react-router-dom";
import { topicSubtopicsMap, topicOptions } from "./Data";

const CreateGroupForm: React.FC = () => {
    const [topic, setTopic] = useState("");
    const [subtopic, setSubtopic] = useState("");
    const [desc, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [days, setDays] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const groupCtx = useContext(groupContext);

    useEffect(() => {
        setSubtopic("");
    }, [topic]);

    const subtopicOptions = topic ? topicSubtopicsMap[topic] || [] : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // 🔴 Validation
        if (!topic) return setError("Please select a topic.");
        if (!subtopic) return setError("Please select a subtopic.");
        if (!desc.trim()) return setError("Description cannot be empty.");
        if (!time) return setError("Please select time.");
        if (!days || Number(days) <= 0) return setError("Enter valid number of days.");

        if (!groupCtx) {
            setError("Something went wrong. Try again.");
            return;
        }

        try {
            setLoading(true);
            const { createGroup } = groupCtx;

            const json = await createGroup({
                topic,
                subtopic,
                desc,
                time,
                days,
            });

            if (json.error) setError(json.error)

            if (json.success) {
                setTopic("");
                setSubtopic("");
                setDescription("");
                setTime("");
                setDays("");
                navigate("/createGroups");
            }

        } catch (err) {
            console.error(err);
            setError("Failed to create group. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-purple-100 px-4">
            <div className="relative w-full max-w-lg backdrop-blur-lg bg-white/80 border border-gray-200 shadow-xl rounded-2xl p-8">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    🚀 Create Study Group
                </h2>

                <button
                    onClick={() => navigate("/createGroups")}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ✕
                </button>

                {/* 🔴 Error Box */}
                {error && (
                    <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <AutoCompleteInput
                        label="Topic"
                        options={topicOptions}
                        value={topic}
                        setValue={setTopic}
                    />

                    <AutoCompleteInput
                        label="Subtopic"
                        options={subtopicOptions}
                        value={subtopic}
                        setValue={setSubtopic}
                        disabled={!topic}
                    />

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full rounded-xl border p-3"
                        />

                        <input
                            type="number"
                            min={1}
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            placeholder="Days"
                            className="w-full rounded-xl border p-3"
                        />
                    </div>

                    {/* Button with loading */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                            }`}
                    >
                        {loading ? "Creating..." : "Create Group"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupForm;
