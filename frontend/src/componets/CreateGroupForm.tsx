import { useContext, useState } from "react";
import AutoCompleteInput from "./AutoCompleteInput";
import groupContext from "../context/groups/groupContext";

const topicOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "Machine Learning",
    "Data Structures",
    "Operating Systems",
    "Computer Networks",
    "DBMS",
];

const subtopicOptions = [
    "Variables",
    "Loops",
    "Functions",
    "Arrays",
    "OOP",
    "Promises",
    "APIs",
    "Hooks",
    "Routing",
];

const CreateGroupForm: React.FC = () => {
    const [topic, setTopic] = useState("");
    const [subtopic, setSubtopic] = useState("");
    const [desc, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [days, setDays] = useState("");

    // ✅ Correct useContext usage
    const groupCtx = useContext(groupContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!groupCtx) {
            console.error("groupContext is NULL.");
            return;
        }

        const { createGroup } = groupCtx;

        await createGroup({
            topic,
            subtopic,
            desc,
            time,
            days,
        });

        setTopic("");
        setSubtopic("");
        setTime("");
        setDescription("");
        setDays("");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Create New Study Group</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Topic */}
                    <AutoCompleteInput
                        label="Topic"
                        options={topicOptions}
                        value={topic}
                        setValue={setTopic}
                    />

                    {/* Subtopic */}
                    <AutoCompleteInput
                        label="Subtopic"
                        options={subtopicOptions}
                        value={subtopic}
                        setValue={setSubtopic}
                    />

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 p-2"
                            placeholder="Describe your study group"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full rounded-lg border p-2 border-gray-300"
                        />
                    </div>

                    {/* Days */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Days to finish topic
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full rounded-lg border p-2 border-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
                    >
                        Create Group
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupForm;
