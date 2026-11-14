import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { validateResume, crc32 } from "./resume";
import { RESUME_MAX_BYTES, resumeInputError, careerSchema } from "./application";
const docxType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const fixture = (ext: string) => readFileSync(new URL(`./__fixtures__/resume.${ext}`, import.meta.url));
const file = (bytes: Uint8Array, name = "resume.pdf", type = "application/pdf") => new File([new Uint8Array(bytes)], name, { type });

describe("bounded résumé format checks", () => {
  it.each(["pdf", "docx"])("preserves exact validated %s bytes with a fixed safe delivery filename", async ext => {
    const original = fixture(ext), result = await validateResume(file(original, `../../Anson’s Résumé.${ext}`, ext === "pdf" ? "application/pdf" : docxType));
    expect(result.bytes.equals(original)).toBe(true);expect(result.filename).toBe(`resume.${ext}`);
  });
  it("checks CRC independently against the standard known vector", () => expect(crc32(Buffer.from("123456789"))).toBe(0xcbf43926));
  it.each([
    [Buffer.alloc(0), "empty.pdf", "application/pdf"],
    [Buffer.from("fake"), "fake.pdf", "application/pdf"],
    [Buffer.from("%PDF-1.7 incomplete"), "cut.pdf", "application/pdf"],
    [fixture("pdf"), "resume.exe", "application/pdf"],
    [fixture("pdf"), "resume.pdf", "text/html"],
    [fixture("pdf"), "bad\nheader.pdf", "application/pdf"],
    [fixture("pdf"), "x".repeat(181)+".pdf", "application/pdf"],
    [Buffer.alloc(RESUME_MAX_BYTES+1), "large.pdf", "application/pdf"],
    [fixture("pdf"), "fake.docx", docxType],
    [fixture("docx").subarray(0,100), "cut.docx", docxType],
  ])("rejects invalid files before delivery", async (bytes, name, type) => { await expect(validateResume(file(bytes as Buffer, name as string, type as string))).rejects.toThrow(); });
  it("rejects arbitrary ZIP/central/local inconsistencies, oversized XML, encryption and overlapping data", async () => {
    const original = fixture("docx"), central = original.indexOf(Buffer.from([0x50,0x4b,0x01,0x02]));
    const mutations = [
      (b: Buffer) => b.writeUInt16LE(1, 6),
      (b: Buffer) => b.writeUInt16LE(1, central+8),
      (b: Buffer) => b.writeUInt32LE(0x7fffffff, central+24),
      (b: Buffer) => b.writeUInt32LE(0x7fffffff, central+20),
      (b: Buffer) => b.writeUInt32LE(1, central+42),
      (b: Buffer) => b.writeUInt32LE(0, central+16),
      (b: Buffer) => b.fill(0, central+46, central+46+19),
    ];
    for (const mutate of mutations) { const bytes = Buffer.from(original);mutate(bytes);await expect(validateResume(file(bytes,"resume.docx",docxType))).rejects.toThrow(); }
  });
  it("uses the same small-file checks for the client", () => { expect(resumeInputError(null)).toMatch(/choose/);expect(resumeInputError(file(fixture("pdf")))).toBeNull(); });
  it("requires genuine contact fields and an allowed position", () => {
    const fields={name:"QA Applicant",email:"fixture@example.com",phone:"9705550100",position:"Carpenter",note:"",company:""};
    expect(careerSchema.safeParse(fields).success).toBe(true);
    for(const change of [{email:"bad"},{name:"X\r\nBcc:test@example.com"},{position:"CEO"},{phone:"1"},{note:"x".repeat(3001)}])expect(careerSchema.safeParse({...fields,...change}).success).toBe(false);
  });
});
