import { inflateRawSync } from "node:zlib";
import { resumeInputError } from "./application";

export class ApplicationError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
const invalid = () => { throw new ApplicationError(400, "We couldn't read that résumé. Please export a PDF or DOCX and try again."); };
export function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Inspect a bounded ordinary OOXML ZIP; no files are extracted or executed.
// Only the small required XML entries are inflated, with a hard output limit.
function validateDocx(bytes: Buffer) {
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (bytes.readUInt32LE(i) === 0x06054b50 && i + 22 + bytes.readUInt16LE(i + 20) === bytes.length) { end = i; break; }
  }
  if (end < 0 || bytes.readUInt32LE(0) !== 0x04034b50) invalid();
  if (bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6)) invalid();
  const count = bytes.readUInt16LE(end + 10), offset = bytes.readUInt32LE(end + 16), size = bytes.readUInt32LE(end + 12);
  if (!count || count > 512 || count !== bytes.readUInt16LE(end + 8) || offset + size !== end) invalid();
  const entries = new Map<string, { start: number; compressed: number; expanded: number; method: number; crc: number }>();
  let cursor = offset, total = 0;
  const ranges: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    if (cursor + 46 > end || bytes.readUInt32LE(cursor) !== 0x02014b50) invalid();
    const flags = bytes.readUInt16LE(cursor + 8), method = bytes.readUInt16LE(cursor + 10), compressed = bytes.readUInt32LE(cursor + 20), expanded = bytes.readUInt32LE(cursor + 24);
    const length = bytes.readUInt16LE(cursor + 28), extra = bytes.readUInt16LE(cursor + 30), comment = bytes.readUInt16LE(cursor + 32), local = bytes.readUInt32LE(cursor + 42);
    const next = cursor + 46 + length + extra + comment;
    if (next > end || !length || length > 240 || flags & ~0x080e || ![0, 8].includes(method) || bytes.readUInt16LE(cursor + 34)) invalid();
    const nameBytes = bytes.subarray(cursor + 46, cursor + 46 + length), name = nameBytes.toString("utf8");
    if (!Buffer.from(name).equals(nameBytes) || /[\\\u0000-\u001f]/.test(name) || name.startsWith("/") || name.split("/").includes("..") || entries.has(name) || /vbaProject|activeX|embeddings\//i.test(name)) invalid();
    if (local + 30 > offset || bytes.readUInt32LE(local) !== 0x04034b50 || bytes.readUInt16LE(local + 6) !== flags || bytes.readUInt16LE(local + 8) !== method) invalid();
    const localLength = bytes.readUInt16LE(local + 26), localExtra = bytes.readUInt16LE(local + 28), start = local + 30 + localLength + localExtra;
    if (localLength !== length || start + compressed > offset || !bytes.subarray(local + 30, local + 30 + localLength).equals(nameBytes)) invalid();
    if (!(flags & 8) && (bytes.readUInt32LE(local + 18) !== compressed || bytes.readUInt32LE(local + 22) !== expanded || bytes.readUInt32LE(local + 14) !== bytes.readUInt32LE(cursor + 16))) invalid();
    total += expanded;
    if (total > 32 * 1024 * 1024 || expanded > 16 * 1024 * 1024 || (method === 0 && compressed !== expanded)) invalid();
    ranges.push([local, start + compressed]);
    entries.set(name, { start, compressed, expanded, method, crc: bytes.readUInt32LE(cursor + 16) }); cursor = next;
  }
  if (cursor !== end) invalid();
  ranges.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < ranges.length; i++) if (ranges[i][0] < ranges[i - 1][1]) invalid();
  const xml = (name: string) => {
    const entry = entries.get(name);
    if (!entry || entry.expanded > 512 * 1024 || !entry.expanded) return invalid();
    const compressed = bytes.subarray(entry.start, entry.start + entry.compressed);
    const expanded = entry.method === 0 ? compressed : inflateRawSync(compressed, { maxOutputLength: 512 * 1024 });
    if (expanded.length !== entry.expanded || crc32(expanded) !== entry.crc) invalid();
    const text = expanded.toString("utf8");
    if (/<!DOCTYPE|<!ENTITY/i.test(text)) invalid();
    return text;
  };
  const types = xml("[Content_Types].xml"), document = xml("word/document.xml"), relationships = xml("_rels/.rels");
  if (!relationships.includes("http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument") || !/Target=["']word\/document\.xml["']/.test(relationships)) invalid();
  if (!/<(?:\w+:)?Types\b/.test(types) || !/PartName=["']\/word\/document\.xml["']/.test(types) || !types.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml") || !/<w:document\b/.test(document) || !document.includes("http://schemas.openxmlformats.org/wordprocessingml/2006/main") || !/<w:body\b/.test(document)) invalid();
}

export async function validateResume(file: File) {
  const error = resumeInputError(file);
  if (error) throw new ApplicationError(file.size > 3 * 1024 * 1024 ? 413 : 400, error);
  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    if (file.name.toLowerCase().endsWith(".pdf")) {
      if (!/^%PDF-\d\.\d/.test(bytes.subarray(0, 8).toString("ascii")) || !/%%EOF\s*$/.test(bytes.subarray(-1024).toString("ascii"))) invalid();
    } else validateDocx(bytes);
  } catch { invalid(); }
  const extension = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "docx";
  // A fixed filename avoids path/header/unicode ambiguity without changing file bytes.
  return { bytes, filename: `resume.${extension}`, contentType: extension === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
}
