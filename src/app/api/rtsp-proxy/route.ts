import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    const url = new URL(req.url).searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url query parameter' }, { status: 400 });
    }

    if (!/^rtsp:/.test(url)) {
        return NextResponse.json({ error: 'Only rtsp:// URLs are supported by this proxy' }, { status: 400 });
    }

    const ffmpeg = spawn('ffmpeg', [
        '-rtsp_transport', 'tcp',
        '-i', url,
        '-f', 'mjpeg',
        '-q:v', '5',
        '-r', '15',
        '-' // stdout
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    ffmpeg.stderr.on('data', (d) => {
        // eslint-disable-next-line no-console
        console.error('[ffmpeg]', d.toString());
    });

    const stream = new ReadableStream({
        start(controller) {
            ffmpeg.stdout.on('data', (chunk: Buffer) => controller.enqueue(chunk));
            ffmpeg.stdout.on('end', () => controller.close());
            ffmpeg.stdout.on('error', (err) => controller.error(err));

            ffmpeg.on('close', () => controller.close());
            ffmpeg.on('error', (err) => controller.error(err));
        },
        cancel() {
            try {
                ffmpeg.kill('SIGKILL');
            } catch (_) {
                // ignore
            }
        }
    });

    const headers = new Headers();
    headers.set('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

    return new Response(stream, { headers });
}
