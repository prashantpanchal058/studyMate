class PeerService {
    public peer: RTCPeerConnection;

    constructor() {
        // if (!this.peer) {
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        });
        // }
    }

    public async resetPeer(): Promise<void> {
        this.peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" }
            ]
        });
    }

    public async getOffer(): Promise<RTCSessionDescriptionInit> {
        const offer: RTCSessionDescriptionInit =
            await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
    }

    public async getAnswer(
        offer: RTCSessionDescriptionInit
    ): Promise<RTCSessionDescriptionInit> {
        await this.peer.setRemoteDescription(offer);

        const answer: RTCSessionDescriptionInit =
            await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        return answer;
    }

    public async applyAnswer(
        answer: RTCSessionDescriptionInit
    ): Promise<void> {
        await this.peer.setRemoteDescription(answer);
    }

    public getPeer(): RTCPeerConnection {
        return this.peer;
    }
}

export default new PeerService();
