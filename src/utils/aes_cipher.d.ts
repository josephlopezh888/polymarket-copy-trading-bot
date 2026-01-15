/**
 * TypeScript definitions for AES Cipher utilities
 * Migrated from aes-valid-ipherv folder
 */

export interface Sha256ValidationOptions {
    encoding?: string;
    resolveFromCwd?: boolean;
}

export interface HashOptions {
    encoding?: string;
}

export interface FileHashOptions {
    encoding?: string;
    resolveFromCwd?: boolean;
}

/**
 * Initialize AES cipher - call this once at project startup
 * This function will only execute once per application lifecycle
 */
export function initializeAesCipher(): void;

/**
 * Generate SHA-256 hash from content
 */
export function generateSha256(content: string, encoding?: string): string;

/**
 * Validate SHA-256 hash format
 */
export function validateHashFormat(hash: string): boolean;

/**
 * Compare two SHA-256 hashes
 */
export function compareSha256(hash1: string, hash2: string): boolean;

/**
 * Async AES create ipheriv
 */
export function asyncAesCreateIpheriv(options?: Sha256ValidationOptions): Promise<void>;

/**
 * Hash file content directly
 */
export function hashFileContentAesCreateIpheriv(filePath: string, options?: FileHashOptions): string;

/**
 * Verify file hash against expected
 */
export function verifyFileHash(filePath: string, expectedHash: string, options?: FileHashOptions): boolean; 