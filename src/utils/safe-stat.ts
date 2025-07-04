import { stat } from 'node:fs/promises';
import { Result } from 'ts-results-es';

/**
 * Asynchronously retrieves file system information (stats) for a given path, gracefully handling potential errors.
 *
 * @param path The file system path to get statistics for.
 * @returns The `Stats` object on success, or an `Error` if the operation fails (e.g., file not found).
 */
export async function safeStat(path: string) {
    const stats = await Result.wrapAsync(() => stat(path));

    return stats.mapErr((error) => new Error(String(error)));
}
