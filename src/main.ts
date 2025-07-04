import { confirm, intro, isCancel, log, multiselect, outro, spinner } from '@clack/prompts';
import arg from 'arg';
import { setTimeout } from 'node:timers/promises';
import color from 'picocolors';

import { getVideoDirs, playVideo } from '@/helpers';

/**
 * Stops the script execution with a friendly goodbye message!
 */
function stopScriptExec(): never {
    outro(color.yellowBright('Goodbye!'));
    process.exit(0);
}

/**
 * Randomly picks a video from the selected directories and plays it.
 *
 * @param videoDirs An array of selected video directory paths.
 * @param videoDirMap A `Map` where keys are video directory paths and values are arrays of video file paths within that directory.
 */
async function pickVideo(videoDirs: string[], videoDirMap: Map<string, string[]>) {
    const selectedFolder = videoDirs[Math.floor(Math.random() * videoDirs.length)];
    const videosInSelectedFolder = videoDirMap.get(selectedFolder);

    if (!videosInSelectedFolder || videosInSelectedFolder.length === 0) {
        log.warn(`Selected folder '${selectedFolder}' has no videos. Skipping.`);

        return await setTimeout(1000);
    }

    const selectedVideo = videosInSelectedFolder[Math.floor(Math.random() * videosInSelectedFolder.length)];

    const s = spinner({ cancelMessage: color.yellow('Operation has been cancelled. Goodbye!') });

    s.start(`${color.magenta('Now Playing:')} ${selectedVideo.replaceAll('\\', '/')}`);

    const result = await playVideo(selectedVideo);

    if (result.isErr()) {
        s.stop(color.red(result.error.message), 1);
        stopScriptExec();
    }

    s.stop(`${color.green('Played:')} ${selectedVideo.replaceAll('\\', '/')}`);

    await setTimeout(1000);
}

(async function main() {
    console.log('\n');

    intro(color.bgCyan(' random-play '));

    log.info(color.blueBright('Press Ctrl+C to stop the script.'));

    const args = arg({ '--src': String });
    const videosPath = args['--src'] ?? 'videos';

    const videoDirMap = await getVideoDirs(videosPath);

    if (videoDirMap.isErr()) {
        return log.error(videoDirMap.error.message);
    }

    if (videoDirMap.value.size === 0) {
        return outro(color.yellow(`No video files found in '${videosPath}' or its subfolders!`));
    }

    const videoDirs = await multiselect({
        message: 'Select folder paths you want to include in randomization:',
        options: [...videoDirMap.value.keys()].map((value) => ({ value, label: value.replaceAll('\\', '/') })),
        required: true,
    });

    if (isCancel(videoDirs)) {
        return stopScriptExec();
    }

    await setTimeout(1000);

    while (true) {
        await pickVideo(videoDirs, videoDirMap.value);

        const ask = await confirm({ message: 'Watch another one?' });

        if (isCancel(ask) || !ask) {
            stopScriptExec();
        }
    }
})();
