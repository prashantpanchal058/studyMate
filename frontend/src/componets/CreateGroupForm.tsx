import { useContext, useEffect, useState } from "react";
import AutoCompleteInput from "./AutoCompleteInput";
import groupContext from "../context/groups/groupContext";

/* ---------------- TOPICS ---------------- */
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

/* -------- TOPIC → SUBTOPIC MAPPING -------- */
const topicSubtopicsMap: Record<string, string[]> = {
    JavaScript: [
        "Variables",
        "Closures",
        "Promises",
        "Async / Await",
        "Event Loop",
        "ES6+",
        "Arrays",
        "Objects",
    ],
    React: [
        "JSX",
        "Components",
        "Props",
        "State",
        "Hooks",
        "Context API",
        "React Router",
        "Performance Optimization",
    ],
    "Node.js": [
        "Event Loop",
        "Express",
        "Middleware",
        "REST APIs",
        "Authentication",
        "File System",
        "Streams",
    ],
    MongoDB: [
        "CRUD Operations",
        "Aggregation Pipeline",
        "Indexes",
        "Schema Design",
        "Mongoose",
        "Transactions",
    ],
    Python: [
        "Syntax Basics",
        "Functions",
        "OOP",
        "Virtual Environments",
        "Libraries",
        "File Handling",
    ],
    "Machine Learning": [
        "Supervised Learning",
        "Unsupervised Learning",
        "Regression",
        "Classification",
        "Neural Networks",
        "Model Evaluation",
    ],
    "Data Structures": [
        "Arrays",
        "Linked Lists",
        "Stacks",
        "Queues",
        "Trees",
        "Graphs",
        "Hash Tables",
    ],
    "Operating Systems": [
        "Processes",
        "Threads",
        "Scheduling",
        "Deadlocks",
        "Memory Management",
        "File Systems",
    ],
    "Computer Networks": [
        "OSI Model",
        "TCP/IP",
        "HTTP/HTTPS",
        "DNS",
        "Routing",
        "Network Security",
    ],
    DBMS: [
        "Normalization",
        "Indexes",
        "Joins",
        "Transactions",
        "ACID Properties",
        "Query Optimization",
    ],
};

const CreateGroupForm: React.FC = () => {
    const [topic, setTopic] = useState("");
    const [subtopic, setSubtopic] = useState("");
    const [desc, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [days, setDays] = useState("");

    const groupCtx = useContext(groupContext);

    /* -------- RESET SUBTOPIC WHEN TOPIC CHANGES -------- */
    useEffect(() => {
        setSubtopic("");
    }, [topic]);

    /* -------- DYNAMIC SUBTOPICS -------- */
    const subtopicOptions = topic ? topicSubtopicsMap[topic] || [] : [];

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

        // Reset form
        setTopic("");
        setSubtopic("");
        setDescription("");
        setTime("");
        setDays("");
    };

    return (
        <div className="flex items-center justify-center">
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

                    {/* Subtopic (dynamic) */}
                    <AutoCompleteInput
                        label="Subtopic"
                        options={subtopicOptions}
                        value={subtopic}
                        setValue={setSubtopic}
                        disabled={!topic}
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
                        <label className="block text-sm font-medium text-gray-700">
                            Time
                        </label>
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
