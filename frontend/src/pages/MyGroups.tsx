import { useEffect, useContext, useState, useCallback } from "react";
import { MessageSquare, Clock } from "lucide-react";
import groupStatusContext from "../context/groupStatus/groupStatusContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

interface PassData {
    id: string
}

const MyGroups: React.FC = () => {
    const groupstatusCtx = useContext(groupStatusContext);

    const [pendingGroups, setPendingGroups] = useState<any[]>([]);
    const [completedGroups, setCompletedGroups] = useState<any[]>([]);

    const socket = useSocket();

    const navigate = useNavigate();

    const acceptRequest = async (id: string) => {
        if (!groupstatusCtx) return;

        try {
            setPendingGroups(prev => prev.filter(group => group.id !== id));

            await groupstatusCtx.updateGroupStatus(id);
            loadCompletedGroups();

        } catch (error) {
            console.error("Failed to accept request", error);
        }
    };

    const loadPendingGroups = async () => {
        if (!groupstatusCtx) return;

        try {
            const response = await groupstatusCtx.getrequestedGroupStatus();
            if (!response.length) return;

            const formatted = response.map((g: any) => ({
                id: g._id,
                groupId: g.groupId?._id,
                topic: g.groupId?.topic || "Unknown Topic",
                subtopic: g.groupId?.subtopic || "Unknown",
                desc: g.groupId?.desc || "No description",
                time: g.groupId?.time || "00:00",
                days: g.groupId?.days || 1,
                progress: g.progress || 0
            }));

            setPendingGroups(formatted);
        } catch (error) {
            console.error("Failed to fetch pending groups", error);
        }
    };

    const isSessionStarted = (groupTime: string) => {
        const [h, m] = groupTime.split(":").map(Number);
        const now = new Date();

        const groupDate = new Date();
        groupDate.setHours(h);
        groupDate.setMinutes(m);
        groupDate.setSeconds(0);

        const nowPlusOne = new Date();
        nowPlusOne.setHours(groupDate.getHours() + 1);

        return now >= groupDate && nowPlusOne >= now;
    };

    const loadCompletedGroups = async () => {
        if (!groupstatusCtx) return;

        try {
            const response = await groupstatusCtx.getAdminGroupStatus();
            if (!response.length) return;

            const formatted = response.map((g: any) => ({
                id: g._id,
                groupId: g.groupId?._id,
                topic: g.groupId?.topic || "Unknown Topic",
                subtopic: g.groupId?.subtopic || "Unknown",
                desc: g.groupId?.desc || "No description",
                time: g.groupId?.time || "00:00",
                days: g.groupId?.days || 1,
                progress: g.progress || 0
            }));

            setCompletedGroups(formatted);
        } catch (error) {
            console.error("Failed to fetch completed groups", error);
        }
    };

    const clickSession = useCallback(async (groupId: string) => {
        if (!groupstatusCtx) return;

        try {
            const group = await groupstatusCtx.getFindStatus(groupId);

            socket?.emit("room:join", {
                userId: group.userId,
                friendId: group.groupMateId
            });

        } catch (error) {
            console.error("Failed to accept request", error);
        }

    }, [groupstatusCtx, socket]);

    useEffect(() => {
        loadCompletedGroups();
        loadPendingGroups();
    }, [groupstatusCtx]);

    const handleJoinRoom = useCallback((data: PassData) => {
        navigate(`/conversation/${data.id}`);
    }, [])

    useEffect(() => {
        if (!socket) return;
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off('room:join', handleJoinRoom)
        }
    }, [socket, handleJoinRoom]);

    return (
        <section className="text-gray-700 body-font">
            <div className="container mx-auto px-5 py-16">

                {/* Completed Groups */}
                <h1 className="text-3xl font-bold text-green-700 mb-6">
                    Your Completed Study Groups
                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {completedGroups.map((group) => (
                        <div
                            key={group.id}
                            className="p-6 bg-green-100 border border-green-300 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold mb-2 text-green-800">
                                {group.topic} — {group.subtopic}
                            </h2>

                            <div className="flex items-start gap-2 text-gray-700 mb-3">
                                <MessageSquare className="w-5 h-5 text-green-700" />
                                <p className="text-sm">{group.desc}</p>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700 mb-3">
                                <Clock className="w-5 h-5" />
                                <span>
                                    Session start :- {group.time} — for {group.days} days
                                </span>
                            </div>

                            <div className="mb-5">
                                <p className="text-sm text-gray-700 mb-1">Group Activity</p>
                                <div className="w-full bg-gray-300 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${group.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-7">
                                {isSessionStarted(group.time) ? (
                                    <button
                                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                        onClick={() => clickSession(group.id)}
                                    >
                                        Start Session
                                    </button>
                                ) : (
                                    <p className="text-red-600 text-sm text-center font-medium">
                                        Session not started yet
                                    </p>
                                )}

                                <MessageSquare className="w-5 h-5 text-orange-700" />
                            </div>
                        </div>
                    ))}

                    {completedGroups.length === 0 && (
                        <p className="text-gray-600 text-center col-span-3">
                            No completed groups found.
                        </p>
                    )}
                </div>

                {/* Pending Requested Groups */}
                <h1 className="text-3xl font-bold text-orange-700 mb-6">
                    Pending Join Requests
                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingGroups.map((group) => (
                        <div
                            key={group.id}
                            className="p-6 bg-orange-100 border border-orange-300 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold mb-2 text-orange-800">
                                {group.topic} — {group.subtopic}
                            </h2>

                            <div className="flex items-start gap-2 text-gray-700 mb-3">
                                <MessageSquare className="w-5 h-5 text-orange-700" />
                                <p className="text-sm">{group.desc}</p>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700 mb-3">
                                <Clock className="w-5 h-5" />
                                <span>
                                    Session start :- {group.time} — for {group.days} days
                                </span>
                            </div>

                            <button
                                className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                                onClick={() => acceptRequest(group.id)}
                            >
                                Accept Request
                            </button>
                        </div>
                    ))}

                    {pendingGroups.length === 0 && (
                        <p className="text-gray-600 text-center col-span-3">
                            No pending requests.
                        </p>
                    )}
                </div>
            </div>
        </section >
    );
};

export default MyGroups;
