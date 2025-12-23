import { useState, useEffect, useContext } from "react";
import { Search, Clock, MessageSquare } from "lucide-react";
import groupContext from "../context/groups/groupContext";
import groupStatusContext from "../context/groupStatus/groupStatusContext";
import AutoCompleteInput from "../componets/AutoCompleteInput";

const FindGroup: React.FC = () => {
    const groupCtx = useContext(groupContext);
    const groupstatusCtx = useContext(groupStatusContext);

    const [requestedGroups, setRequestedGroups] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [topicFilter, setTopicFilter] = useState("");
    const [subtopicFilter, setSubtopicFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("Any");

    const [groups, setGroups] = useState<any[]>([]);

    const getTimeSlot = (time: string) => {
        const [hour] = time.split(":").map(Number);

        if (hour >= 5 && hour < 12) return "Morning";
        if (hour >= 12 && hour < 17) return "Afternoon";
        if (hour >= 17 && hour < 22) return "Evening";
        return "Night";
    };

    const sendRequestGroup = async (id: string) => {
        try {
            if (!groupstatusCtx) return;

            const groupstatus = await groupstatusCtx.getFindGroupStatus(id);

            if (groupstatus && groupstatus.status === "request") {
                await groupstatusCtx.deleteGroupStatus(groupstatus._id);
                setRequestedGroups(prev => prev.filter(gid => gid !== id));
                return;
            }

            await groupstatusCtx.createGroupStatus(id);
            setRequestedGroups(prev => [...prev, id]);


        } catch (error) {
            console.error("Request failed", error);
        }
    };

    useEffect(() => {
        if (!groupCtx) return;

        const fetchGroups = async () => {
            try {
                const data = await groupCtx.getAllGroup();
                setGroups(data || []);
            } catch (err) {
                console.error("Failed fetching groups", err);
            }
        };

        fetchGroups();
    }, [groupCtx]);

    const filteredGroups = groups.filter(group => {
        const matchSearch =
            group.topic.toLowerCase().includes(search.toLowerCase()) ||
            group.subtopic.toLowerCase().includes(search.toLowerCase()) ||
            group.desc.toLowerCase().includes(search.toLowerCase());

        const matchTopic =
            topicFilter === "" || group.topic === topicFilter;

        const matchSubtopic =
            subtopicFilter === "" || group.subtopic === subtopicFilter;

        const matchTime =
            !timeFilter || timeFilter === "Any" ||
            getTimeSlot(group.time) === timeFilter;


        return matchSearch && matchTopic && matchSubtopic && matchTime;
    });

    return (
        <section className="text-gray-700 body-font">
            <div className="container mx-auto px-5 py-10">

                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Find a Study Group
                </h1>

                <div className="grid md:grid-cols-4 gap-4 mb-10">

                    <div className="col-span-2 relative mt-6">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Search groups or subjects..."
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
                    </div>

                    <AutoCompleteInput
                        label="Topic"
                        value={topicFilter}
                        setValue={setTopicFilter}
                        options={[
                            "Web Development",
                            "AI / Machine Learning",
                            "Data Structures",
                            "Computer Networks",
                            "Cyber Security",
                            "DevOps",
                        ]}
                    />

                    <AutoCompleteInput
                        label="Subtopic"
                        value={subtopicFilter}
                        setValue={setSubtopicFilter}
                        options={[
                            "React",
                            "Nodejs",
                            "Angular",
                            "Express",
                            "Next.js",
                            "JavaScript",
                        ]}
                    />

                    <select
                        className="border border-gray-300 rounded-lg py-2 px-4"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <option value="Any">Any Time</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                    </select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGroups.map((group) => (
                        <div
                            key={group._id}
                            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {group.topic} — {group.subtopic}
                            </h2>

                            <div className="flex items-start gap-2 text-gray-600 mb-3">
                                <MessageSquare className="w-5 h-5 text-gray-500" />
                                <p className="text-sm">{group.desc}</p>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <Clock className="w-5 h-5" />
                                <span>
                                    Time: {getTimeSlot(group.time)} ({group.time}) — {group.days} days
                                </span>
                            </div>

                            <button
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                                onClick={() => sendRequestGroup(group._id)}
                            >
                                {requestedGroups.includes(group._id) ? "Requested" : "Join Group"}
                            </button>

                        </div>
                    ))}

                    {filteredGroups.length === 0 && (
                        <p className="text-gray-600 text-center col-span-3">
                            No groups found with current filters.
                        </p>
                    )}
                </div>

            </div>
        </section>
    );
};

export default FindGroup;
