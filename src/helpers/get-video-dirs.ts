import { join } from 'node:path';
import { Ok, type Result } from 'ts-results-es';

import { VIDEO_EXTS } from '@/constants';

import { safeReadDirWithFileType, safeStat } from '@/utils';

/**
 * Scans a source path and its subdirectories to find all video files.
 * It builds a map where each key is a directory path containing videos,
 * and its value is an array of full paths to the video files within that directory.
 *
 * @param srcPath The root directory path to start scanning for video files.
 * @returns A `Map` of directory paths to arrays of video file paths on success.
 */
export async function getVideoDirs(srcPath: string): Promise<Result<Map<string, string[]>, Error>> {
    const folderVideoMap = new Map<string, string[]>();
    const stats = await safeStat(srcPath);

    if (stats.isErr()) {
        return Ok(new Map<string, string[]>());
    }

    if (!stats.value.isDirectory()) {
        return Ok(new Map<string, string[]>());
    }

    const walkDir = async (currentPath: string) => {
        const dirents = await safeReadDirWithFileType(currentPath);

        if (dirents.isErr()) {
            return;
        }

        for (const dirent of dirents.value) {
            const fullPath = join(currentPath, dirent.name);

            if (dirent.isDirectory()) {
                await walkDir(fullPath);
            }

            if (dirent.isFile()) {
                if (VIDEO_EXTS.some((ext) => dirent.name.toLowerCase().endsWith(ext))) {
                    if (!folderVideoMap.has(currentPath)) {
                        folderVideoMap.set(currentPath, []);
                    }

                    folderVideoMap.get(currentPath)?.push(fullPath);
                }
            }
        }
    };

    await walkDir(srcPath);

    return Ok(folderVideoMap);
}
