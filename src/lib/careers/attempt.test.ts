import { describe, it, expect } from "vitest";
import { selectCareerAttempt } from "./attempt";
const fields={name:"QA Applicant",email:"fixture@example.com",phone:"9705550100",position:"Carpenter" as const,note:"",company:""};
const file=(value="first",name="resume.pdf")=>new File([value],name,{type:"application/pdf"});
const firstId="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",secondId="59a3999c-0ce1-4ea6-ab68-afcd6dc2e794";
describe("careers page-memory retry identity",()=>{
 it("reuses unchanged fields/file bytes even for a newly selected identical file",async()=>{const a=await selectCareerAttempt(null,fields,file(),1,()=>firstId);expect(await selectCareerAttempt(a,fields,file(),2,()=>secondId)).toBe(a);});
 it("changes identity for edited fields, filename or file bytes",async()=>{const a=await selectCareerAttempt(null,fields,file(),1,()=>firstId);for(const [f,d]of [[file("second"),fields],[file("first","changed.pdf"),fields],[file(),{...fields,note:"Edited"}]] as const)expect((await selectCareerAttempt(a,d,f,2,()=>secondId)).id).toBe(secondId);});
 it("fails closed for expired/clock-reversed intent or invalid UUID",async()=>{const a=await selectCareerAttempt(null,fields,file(),100,()=>firstId);for(const now of [1,100+23*60*60*1000])await expect(selectCareerAttempt(a,fields,file(),now)).rejects.toThrow(/safely retried/);await expect(selectCareerAttempt(null,fields,file(),1,()=>"bad")).rejects.toThrow();});
});
