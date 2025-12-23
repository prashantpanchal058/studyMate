// import { useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useCallback, useEffect, useState } from "react";
import peer from "../service/peer";

interface PassData {
    id: string,
    roomId: string
}

interface Incoming {
    from: string,
    offer: RTCSessionDescriptionInit
}

interface NegoFinalPayload {
    ans: RTCSessionDescriptionInit;
}

const ConversationGUI: React.FC = () => {
    const [remoteSocketId, setRemoteSocketId] = useState<string>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const socket = useSocket();
    // const peerConnection = peer.getPeer();
    const [myStream, setMyStream] = useState<MediaStream>();

    const handleUserJoined = useCallback((data: PassData) => {
        setRemoteSocketId(data.id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        const offer = await peer.getOffer();

        if (!socket) {

            return
        }

        socket.emit("user:call", {
            to: remoteSocketId,
            offer
        });
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async (data: Incoming) => {
            setRemoteSocketId(data.from);

            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            setMyStream(stream);

            const ans = await peer.getAnswer(data.offer);

            // Send answer back
            socket?.emit("call:accepted", {
                to: data.from,
                ans,
            });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        if (!myStream) return;
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream)
        }
    }, [myStream])

    useEffect(() => {
        peer.peer.addEventListener('track', async ev => {
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream[0]);
        });
    }, []);


    // CALL ACCEPTED
    const handleCallAccepted = useCallback((data: NegoFinalPayload) => {
        peer.applyAnswer(data.ans);
        sendStreams();
    }, [sendStreams]);

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket?.emit('peer:nego:needed', { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        }
    }, [handleNegoNeeded]);

    const handleNegoNeedIncoming = useCallback(async ({ from, offer }: Incoming) => {
        const ans = await peer.getAnswer(offer);
        socket?.emit("peer:nego:done", { to: from, ans });
    }, [socket]);

    const handleNegoNeedFinal = useCallback(async ({ ans }: NegoFinalPayload) => {
        await peer.applyAnswer(ans);
    }, []);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on('peer:nego:needed', handleNegoNeedIncoming);
        socket.on('peer:nego:final', handleNegoNeedFinal);
        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off('peer:nego:needed', handleNegoNeedIncoming);
            socket.off('peer:nego:final', handleNegoNeedFinal);
        }
    }, [socket, handleIncommingCall, handleUserJoined, handleCallAccepted, handleNegoNeedIncoming,
        handleNegoNeedFinal])

    const switchToTabShare = async () => {
        const tabStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: "browser" },
            audio: true
        });

        const videoTrack = tabStream.getVideoTracks()[0];

        const sender = peer.peer.getSenders().find(
            s => s.track && s.track.kind === "video"
        );

        if (sender) {
            sender.replaceTrack(videoTrack);
        }

        setMyStream(tabStream);
    };

    const switchBackToCamera = async () => {
        const camStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        const camTrack = camStream.getVideoTracks()[0];

        const sender = peer.peer.getSenders().find(
            s => s.track && s.track.kind === "video"
        );

        if (sender) {
            await sender.replaceTrack(camTrack);
        }

        setMyStream(camStream);

        // 🔥 renegotiate after switching track
        const offer = await peer.getOffer();
        socket?.emit("peer:nego:needed", { to: remoteSocketId, offer });
    };

    const handleLeaveCall = useCallback(() => {
        // 1. Stop local media
        myStream?.getTracks().forEach(track => track.stop());

        // 2. Remove senders
        peer.peer.getSenders().forEach(sender => {
            peer.peer.removeTrack(sender);
        });

        // 3. Close peer connection
        peer.peer.close();

        // 4. Reset peer instance (VERY IMPORTANT)
        peer.resetPeer(); // see below

        // 5. Clear UI state
        setMyStream(undefined);
        setRemoteStream(undefined);
        setRemoteSocketId(undefined);

        // 6. Notify other user (optional but correct)
        socket?.emit("call:leave", { to: remoteSocketId });
    }, [myStream, remoteSocketId, socket]);


    return (
        <div className="h-screen w-full bg-gray-100 p-0 m-0 overflow-hidden flex">
            <div className="w-80 bg-white h-full p-5 shadow-lg flex flex-col gap-6 border-r">
                <div className="flex flex-col flex-1">
                    <h2 className="text-lg font-semibold mb-3">Chat</h2>
                    <div className="flex-1 overflow-y-auto border rounded p-3 bg-gray-50 space-y-3 text-sm">
                        <div className="text-gray-400">No messages yet</div>

                        <div className="text-right">
                            <div className="text-xs text-gray-400 mb-1">You • 12:30</div>
                            <div className="inline-block px-3 py-2 bg-blue-600 text-white rounded">Hello!</div>
                        </div>

                        <div className="text-left">
                            <div className="text-xs text-gray-400 mb-1">Other • 12:31</div>
                            <div className="inline-block px-3 py-2 border rounded bg-white">Hi there!</div>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <input className="flex-1 px-3 py-2 border rounded" placeholder="Message..." />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-black h-full flex flex-col p-4 gap-4">
                <h2 className="text-lg font-semibold text-white">Video Call</h2>

                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-gray-900 rounded flex items-center justify-center text-white">
                        {remoteStream && (
                            <div className="h-full w-full pb-2">
                                <video
                                    ref={(video) => {
                                        if (video) video.srcObject = remoteStream;
                                    }}
                                    autoPlay
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded shadow-lg flex items-center justify-center text-white border border-white/20">
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 px-1 py-px rounded">You</span>
                        {myStream && (
                            <div>
                                <video
                                    ref={(video) => {
                                        if (video) video.srcObject = myStream;
                                    }}
                                    autoPlay
                                    muted
                                    playsInline
                                    height="300"
                                    width="300"
                                />
                            </div>
                        )}
                        {/* Local Video */}
                    </div>
                </div>

                <div className="flex gap-3 justify-center py-2">
                    <button className="px-4 py-2 border rounded bg-white/10 text-white">Mute</button>
                    <button className="px-4 py-2 border rounded bg-white/10 text-white">Camera Off</button>
                    <button className="px-4 py-2 border rounded bg-white/10 text-white" onClick={switchToTabShare}>Share Screen</button>
                    <button className="px-4 py-2 border rounded bg-white/10 text-white" onClick={switchBackToCamera}>Back To Camera</button>
                    <button className="px-4 py-2 border rounded bg-white/10 text-white">Stop Share</button>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCallUser}>Join</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleLeaveCall}>Leave</button>

                </div>
            </div>

        </div >
    );
}

export default ConversationGUI;