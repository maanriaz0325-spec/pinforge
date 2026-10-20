import zlib from "zlib";

interface ZipFileEntry {
  filename: string;
  data: Buffer;
}

/**
 * Fast, pure-TypeScript ZIP archive creator with zero external dependencies.
 * Uses standard ZIP specification with Deflate compression and CRC32 checksums.
 */
export function createZipArchive(files: ZipFileEntry[]): Buffer {
  const localFileChunks: Buffer[] = [];
  const centralDirChunks: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const filenameBuffer = Buffer.from(file.filename, "utf-8");
    const crc = crc32(file.data);
    const compressedData = zlib.deflateRawSync(file.data);

    // 1. Local file header (30 bytes + filename length)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4);         // Version needed to extract (2.0)
    localHeader.writeUInt16LE(0, 6);          // General purpose bit flag
    localHeader.writeUInt16LE(8, 8);          // Compression method: 8 = Deflate
    localHeader.writeUInt16LE(0, 10);         // Last mod file time
    localHeader.writeUInt16LE(0, 12);         // Last mod file date
    localHeader.writeUInt32LE(crc, 14);       // CRC-32
    localHeader.writeUInt32LE(compressedData.length, 18); // Compressed size
    localHeader.writeUInt32LE(file.data.length, 22);       // Uncompressed size
    localHeader.writeUInt16LE(filenameBuffer.length, 26); // Filename length
    localHeader.writeUInt16LE(0, 28);         // Extra field length

    localFileChunks.push(localHeader, filenameBuffer, compressedData);

    // 2. Central directory record (46 bytes + filename length)
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0);    // Central directory file header signature
    cdHeader.writeUInt16LE(20, 4);            // Version made by
    cdHeader.writeUInt16LE(20, 6);            // Version needed to extract
    cdHeader.writeUInt16LE(0, 8);             // General purpose bit flag
    cdHeader.writeUInt16LE(8, 10);            // Compression method (Deflate)
    cdHeader.writeUInt16LE(0, 12);            // Last mod file time
    cdHeader.writeUInt16LE(0, 14);            // Last mod file date
    cdHeader.writeUInt32LE(crc, 16);          // CRC-32
    cdHeader.writeUInt32LE(compressedData.length, 20); // Compressed size
    cdHeader.writeUInt32LE(file.data.length, 24);       // Uncompressed size
    cdHeader.writeUInt16LE(filenameBuffer.length, 28); // Filename length
    cdHeader.writeUInt16LE(0, 30);            // Extra field length
    cdHeader.writeUInt16LE(0, 32);            // File comment length
    cdHeader.writeUInt16LE(0, 34);            // Disk number start
    cdHeader.writeUInt16LE(0, 36);            // Internal file attributes
    cdHeader.writeUInt32LE(0, 38);            // External file attributes
    cdHeader.writeUInt32LE(offset, 42);       // Relative offset of local header

    centralDirChunks.push(cdHeader, filenameBuffer);

    offset += localHeader.length + filenameBuffer.length + compressedData.length;
  }

  const centralDirSize = centralDirChunks.reduce((acc, c) => acc + c.length, 0);

  // 3. End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);          // End of central dir signature
  eocd.writeUInt16LE(0, 4);                   // Number of this disk
  eocd.writeUInt16LE(0, 6);                   // Disk where central directory starts
  eocd.writeUInt16LE(files.length, 8);        // Number of central directory records on this disk
  eocd.writeUInt16LE(files.length, 10);       // Total number of central directory records
  eocd.writeUInt32LE(centralDirSize, 12);     // Size of central directory
  eocd.writeUInt32LE(offset, 16);             // Offset of start of central directory
  eocd.writeUInt16LE(0, 20);                  // Comment length

  return Buffer.concat([...localFileChunks, ...centralDirChunks, eocd]);
}

/**
 * Standard CRC32 table implementation
 */
function crc32(buf: Buffer): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c;
}
