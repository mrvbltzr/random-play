import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { Err, Ok, Result } from 'ts-results-es';

// On Windows, it's typically "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe"
// On macOS, it might be "/Applications/VLC.app/Contents/MacOS/VLC"
// On Linux, it's often just "vlc" if it's in your PATH
const VLC_PATH: string = 'C:/Program Files/VideoLAN/VLC/vlc.exe';

/**
 * Plays a video using VLC and waits for VLC to close.
 *
 * @param videoPath The full path to the video file.
 * @returns Exit code if the video started and VLC closed, Error otherwise.
 */
export async function playVideo(videoPath: string): Promise<Result<number, Error>> {
    if (!existsSync(VLC_PATH)) {
        return Err(new Error(`VLC executable not found at '${VLC_PATH}'. Please check your VLC.`));
    }

    if (!existsSync(videoPath)) {
        return Err(new Error(`Video file not found at '${VLC_PATH}'. Skipping playback.`));
    }

    return new Promise((resolve) => {
        try {
            const vlcProcess = spawn(VLC_PATH, [videoPath, '--fullscreen'], {
                detached: false, // Keep process attached to allow waiting for its exit
                stdio: 'ignore', // Ignore stdout/stderr of VLC to keep console clean
            });

            vlcProcess.on('error', (err) => resolve(Err(new Error(`Failed to start VLC process: ${err.message}`))));
            vlcProcess.on('close', (code) => resolve(Ok(code ?? 0)));
        } catch (e) {
            resolve(Err(new Error(`An error occurred while trying to play the video: ${String(e)}`)));
        }
    });
}
