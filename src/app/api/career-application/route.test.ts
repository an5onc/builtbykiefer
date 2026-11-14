import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { POST } from "./route";
import { APPLICATION_MAX_BYTES, CAREER_ATTEMPT_HEADER } from "@/lib/careers/application";
const attempt="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794";
const fields={name:"QA Applicant",email:"fixture@example.com",phone:"9705550100",position:"Carpenter",note:"<script>fictional note</script>",company:""};
const fixture=(ext="pdf")=>readFileSync(new URL(`../../../lib/careers/__fixtures__/resume.${ext}`,import.meta.url));
function data(ext="pdf") { const form=new FormData();for(const [k,v]of Object.entries(fields))form.set(k,v);form.set("resume",new File([new Uint8Array(fixture(ext))],`../../QA’s Résumé.${ext}`,{type:ext==="pdf"?"application/pdf":"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}));return form; }
const request=(form=data(),headers:HeadersInit={})=>new Request("http://localhost/api/career-application",{method:"POST",body:form,headers:{[CAREER_ATTEMPT_HEADER]:attempt,...headers}});
describe("career application route",()=>{
 const transport=vi.fn<typeof fetch>();
 beforeEach(()=>{vi.stubGlobal("fetch",transport);transport.mockReset();transport.mockResolvedValue(Response.json({id:attempt}));vi.stubEnv("RESEND_API_KEY","fixture-only");vi.stubEnv("CONTACT_EMAIL_FROM","Kiefer Built <fixture@example.com>");vi.stubEnv("CONTACT_EMAIL_TO","different-quote-inbox@example.com");vi.spyOn(console,"info").mockImplementation(()=>{});});
 afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();vi.unstubAllEnvs();});
 it.each(["pdf","docx"])("sends original %s bytes to all three approved recipients only after validation",async ext=>{
  const response=await POST(request(data(ext)));expect(response.status).toBe(200);expect(await response.json()).toEqual({ok:true,emailSent:true});expect(response.headers.get("cache-control")).toBe("no-store");expect(response.headers.get("set-cookie")).toBeNull();expect(transport).toHaveBeenCalledTimes(1);
  const [url,init]=transport.mock.calls[0];expect(url).toBe("https://api.resend.com/emails");expect(new Headers(init?.headers).get("idempotency-key")).toBe(`career-application/${attempt}`);
  const payload=JSON.parse(String(init?.body));expect(payload.to).toEqual(["info@kbuiltco.com","lauren@kbuiltco.com","mark@kbuiltco.com"]);expect(payload.reply_to).toBe(fields.email);expect(payload.cc).toBeUndefined();expect(payload.bcc).toBeUndefined();expect(payload.attachments).toHaveLength(1);expect(payload.attachments[0].filename).toBe(`resume.${ext}`);expect(Buffer.from(payload.attachments[0].content,"base64").equals(fixture(ext))).toBe(true);expect(payload.html).not.toContain("<script>");expect(payload.html).toContain("&lt;script&gt;");expect(init?.signal).toBeInstanceOf(AbortSignal);
 });
 it.each([undefined," ","other@example.com","info@kbuiltco.com","other@example.com,extra@example.com"])("keeps the approved recipients regardless of legacy CONTACT_EMAIL_TO: %s",async legacy=>{
  vi.stubEnv("CONTACT_EMAIL_TO",legacy);expect((await POST(request())).status).toBe(200);expect(transport).toHaveBeenCalledTimes(1);expect(JSON.parse(String(transport.mock.calls[0][1]?.body)).to).toEqual(["info@kbuiltco.com","lauren@kbuiltco.com","mark@kbuiltco.com"]);
 });
 it("preserves the complete note even if it resembles recovery instructions",async()=>{
  const form=data();const note="First paragraph.\n\nPlease attach my references if needed.\nLast paragraph.";form.set("note",note);expect((await POST(request(form))).status).toBe(200);const payload=JSON.parse(String(transport.mock.calls[0][1]?.body));expect(payload.text.replace(/\r\n/g,"\n")).toContain(note);expect(payload.text).toContain("Résumé: resume.pdf");expect(payload.text).not.toContain("Copying does not submit");
 });
 it("is deterministic across retries, with a separate namespace from quotes",async()=>{await POST(request());const first=transport.mock.calls[0][1]?.body;transport.mockResolvedValue(Response.json({id:attempt}));await POST(request());expect(transport.mock.calls[1][1]?.body).toBe(first);});
 it.each(["name","email","phone","position","resume"])("rejects missing %s without calling provider",async name=>{const form=data();form.delete(name);expect((await POST(request(form))).status).toBe(400);expect(transport).not.toHaveBeenCalled();});
 it("rejects duplicate, unknown, file-as-text, multiple-file and text-as-file inputs",async()=>{
  for(const change of [(f:FormData)=>f.append("name","Again"),(f:FormData)=>f.set("to","attacker@example.com"),(f:FormData)=>f.set("resume","not a file"),(f:FormData)=>f.append("resume",new File(["x"],"second.pdf")),(f:FormData)=>f.set("name",new File(["x"],"name.txt"))]){const form=data();change(form);expect((await POST(request(form))).status).toBe(400);}
  expect(transport).not.toHaveBeenCalled();
 });
 it.each(["not-pdf","empty","oversized","mime"])("rejects %s upload before provider",async mode=>{const form=data();form.set("resume",new File([mode==="empty"?"":mode==="oversized"?new Uint8Array(3*1024*1024+1):"not a PDF"],"resume.pdf",{type:mode==="mime"?"text/html":"application/pdf"}));expect([400,413]).toContain((await POST(request(form))).status);expect(transport).not.toHaveBeenCalled();});
 it("rejects cross-site/forged origins and missing or invalid attempt ID",async()=>{
  for(const headers of [{origin:"http://other.example"},{origin:"http://localhost/path"},{origin:"null"},{"sec-fetch-site":"cross-site"},{[CAREER_ATTEMPT_HEADER]:""},{[CAREER_ATTEMPT_HEADER]:"invalid"}] as Record<string,string>[])expect([400,403]).toContain((await POST(request(data(),headers))).status);
  expect(transport).not.toHaveBeenCalled();
 });
 it("compares actual Host without trusting forwarded origin",async()=>{expect((await POST(request(data(),{host:"public.example",origin:"http://public.example","x-forwarded-host":"evil.example"}))).status).toBe(200);});
 it("rejects wrong or malformed multipart format",async()=>{
  for(const contentType of ["application/json","multipart/form-data","multipart/form-data; boundary=",'multipart/form-data; boundary="'+"x".repeat(71)+'"'])expect((await POST(new Request("http://localhost/api/career-application",{method:"POST",headers:{[CAREER_ATTEMPT_HEADER]:attempt,"content-type":contentType},body:"{}"}))).status).toBe(415);
  expect((await POST(new Request("http://localhost/api/career-application",{method:"POST",headers:{[CAREER_ATTEMPT_HEADER]:attempt,"content-type":"multipart/form-data; boundary=abc"},body:"broken"}))).status).toBe(400);expect(transport).not.toHaveBeenCalled();
 });
 it.each([undefined,"1",String(APPLICATION_MAX_BYTES+1)])("enforces total body bytes for absent/lying/oversized Content-Length",async length=>{
  let cancelled=false;
  const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(APPLICATION_MAX_BYTES+1));},cancel(){cancelled=true;}});
  const req=new Request("http://localhost/api/career-application",{method:"POST",headers:{[CAREER_ATTEMPT_HEADER]:attempt,"content-type":"multipart/form-data; boundary=abc",...(length?{"content-length":length}:{})},body:stream,duplex:"half"} as RequestInit);
  expect((await POST(req)).status).toBe(413);if(length!==String(APPLICATION_MAX_BYTES+1))expect(cancelled).toBe(true);expect(transport).not.toHaveBeenCalled();
 });
 it("does not claim email acceptance for the honeypot",async()=>{const form=data();form.set("company","bot");const response=await POST(request(form));expect(await response.json()).toEqual({ok:true});expect(transport).not.toHaveBeenCalled();});
 it("fails honestly if email is unconfigured",async()=>{vi.stubEnv("RESEND_API_KEY","");const response=await POST(request());expect(response.status).toBe(503);expect((await response.json()).code).toBe("email_not_configured");expect(transport).not.toHaveBeenCalled();});
 it.each([403,429,500,409])("preserves failed delivery semantics for provider%s",async status=>{transport.mockResolvedValue(new Response("private provider detail",{status}));const response=await POST(request());expect(response.status).toBe(status===409?409:502);const text=await response.text();expect(text).not.toContain("private provider detail");expect(text).not.toContain('"emailSent":true');expect(response.headers.get("set-cookie")).toBeNull();expect(transport).toHaveBeenCalledTimes(1);});
 it.each(["timeout","network","unreadable","no-id"])("reports uncertain acceptance for %s without retry",async mode=>{if(mode==="timeout")transport.mockRejectedValue(new DOMException("Timeout","TimeoutError"));if(mode==="network")transport.mockRejectedValue(Error("private transport"));if(mode==="unreadable")transport.mockResolvedValue(new Response("{"));if(mode==="no-id")transport.mockResolvedValue(Response.json({ok:true}));const response=await POST(request());expect(response.status).toBe(502);expect((await response.json()).code).toBe("email_unconfirmed");expect(transport).toHaveBeenCalledTimes(1);});
});
