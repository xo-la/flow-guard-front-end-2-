this is the read me 

RTSP streaming notes
--------------------

The app includes a simple server-side RTSP -> MJPEG proxy at `/api/rtsp-proxy` which requires `ffmpeg` to be installed on the host running the Next.js server. The proxy is used by the Camera Management UI to display an IP camera stream.

Example environment variable to set a default camera URL:

```
NEXT_PUBLIC_RTSP_URL=rtsp://admin:TZBWFG@192.158.0.5:534/h364_stream
```

If you prefer the local webcam for testing, use the value `0` in the settings UI.

