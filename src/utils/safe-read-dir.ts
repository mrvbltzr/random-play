import { readdir } from 'node:fs/promises';
import { Result } from 'ts-results-es';

/**
 * Asynchronously reads the contents of a directory.
 *
 * @param path The path to the directory to read.
 * @returns An array of filenames or an `Error` if the operation fails.
 */
export async function safeReadDir(path: string) {
    const wrapper = await Result.wrapAsync(() => readdir(path));

    return wrapper.mapErr((err) => new Error(String(err)));
}

/**
 * Asynchronously reads the contents of a directory, including file type information.
 *
 * @param path The path to the directory to read.
 * @returns An array of `Dirent` objects  (which include file type information) or an `Error` if the operation fails.
 */
export async function safeReadDirWithFileType(path: string) {
    const wrapper = await Result.wrapAsync(() => readdir(path, { withFileTypes: true }));

    return wrapper.mapErr((err) => new Error(String(err)));
}
