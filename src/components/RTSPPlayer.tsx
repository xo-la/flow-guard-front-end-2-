"use client";

import React, { useEffect, useRef } from "react";

interface Props {
    source: string; // '0' for local webcam, otherwise an rtsp:// URL
    className?: string;
}

export default function RTSPPlayer({ source, className }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        async function startWebcam() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("webcam error", err);
            }
        }

        if (source === "0") {
            startWebcam();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [source]);

    if (source === "0") {
        return (
            <video ref={videoRef} autoPlay playsInline muted className={className || "w-full h-full object-cover"} />
        );
    }

    // For RTSP, we rely on the server-side ffmpeg proxy which serves MJPEG
    const proxyUrl = `/api/rtsp-proxy?url=${encodeURIComponent(source)}`;

    return (
        <img
            src={proxyUrl}
            alt="IP Camera Stream"
            className={className || "w-full h-full object-cover"}
        // allow the browser to show progressively updating MJPEG frames
        />
    );
}
