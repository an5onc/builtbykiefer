import {readFile} from "node:fs/promises";
import {join} from "node:path";
import {test,expect,contain,origin,runRoot,mode,providerState} from "./helpers.mjs";

const form=page=>page.getByRole("form",{name:"Career application",exact:true});
const button=page=>form(page).getByRole("button",{name:"Submit Application",exact:true});
const resume=page=>form(page).getByLabel("Résumé *",{exact:true});
// Filesystem-backed Playwright inputs lose file bytes when CDP route.fetch replays
// multipart requests. Materialize the exact manifest-pinned synthetic bytes in
// the browser File, preserving the real UI upload/handler/provider path.
const chooseResume=async(page,ext)=>resume(page).setInputFiles({name:`resume.${ext}`,mimeType:ext==="pdf"?"application/pdf":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",buffer:await readFile(join(runRoot,`resume.${ext}`))});
async function fill(page,ext="pdf"){
 await expect(button(page)).toBeEnabled();
 for(const [label,value]of [["Full name *","QA Fictional Applicant"],["Email *","fixture@example.com"],["Phone *","9705550100"]])await form(page).getByLabel(label,{exact:true}).fill(value);
 await form(page).getByLabel("Position of interest *",{exact:true}).selectOption("Carpenter");
 await form(page).getByLabel(/Anything you/).fill("Fictional local browser application. No real applicant data.");
 await chooseResume(page,ext);
}
async function send(page){const r=page.waitForResponse(r=>r.url()===origin+"/api/career-application"&&r.request().method()==="POST");await button(page).click();return r;}
async function preserved(page){await expect(button(page)).toBeEnabled();await expect(form(page).getByLabel("Full name *",{exact:true})).toHaveValue("QA Fictional Applicant");await expect(form(page).getByLabel("Position of interest *",{exact:true})).toHaveValue("Carpenter");expect(await resume(page).evaluate(e=>e.files.length)).toBe(1);expect(new URL(page.url()).pathname).toBe("/careers");}

test.beforeEach(async()=>{await mode("accept");});
test("27 careers apply/upload/confirmation on phone and desktop with exact attachments",async({page:defaultPage,browser})=>{
 const errors=[];
 for(const [width,ext]of [[390,"pdf"],[1440,"docx"]]){
  const context=await browser.newContext({baseURL:origin,viewport:{width,height:1000},serviceWorkers:"block"});const guards=await contain(context);
  try{
   const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
   const before=await providerState();await page.goto("/careers");
   await expect(page.getByRole("link",{name:"Email Your Resume",exact:true})).toHaveCount(0);await expect(page.getByRole("link",{name:"Contact The Team",exact:true})).toHaveCount(0);
   await expect(page.getByRole("heading",{name:"Ready to talk through a project?",exact:true})).toHaveCount(0);
   await page.getByRole("link",{name:"Apply Now",exact:true}).first().click();await expect(page).toHaveURL(origin+"/careers#apply");
   await button(page).click();expect(await form(page).evaluate(f=>f.checkValidity())).toBe(false);expect((await providerState()).calls.length).toBe(before.calls.length);
   await fill(page,ext);await expect(page.getByRole("link",{name:"Get a free quote from Kiefer Built",exact:true})).toHaveCount(0);await page.locator("#apply").screenshot({path:join(runRoot,`careers-${width}.png`)});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
   expect((await send(page)).status()).toBe(200);await expect(form(page).getByRole("status")).toContainText("accepted for email delivery");await expect(form(page).getByRole("status")).toBeFocused();await expect(button(page)).toBeEnabled();expect(await resume(page).evaluate(e=>e.files.length)).toBe(0);
   const after=await providerState();expect(after.acceptedEmails).toBe(before.acceptedEmails+1);expect(after.calls.at(-1).career).toBe(true);
   expect((await context.cookies()).filter(c=>c.name==="kiefer_quote_accepted")).toHaveLength(0);expect(new URL(page.url()).pathname).toBe("/careers");expect(guards.outbound).toEqual([]);
  }finally{await guards.drain();await context.close();}
 }
 await defaultPage.goto("/process");await expect(defaultPage.getByRole("heading",{name:"Ready to talk through a project?",exact:true})).toBeVisible();await defaultPage.evaluate(()=>scrollTo(0,1000));await expect(defaultPage.getByRole("link",{name:"Get a free quote from Kiefer Built",exact:true})).toBeVisible();expect(errors).toEqual([]);
});

test("28 careers rejection,429,uncertain acceptance,recovery and explicit unchanged retry",async({page})=>{
 await page.goto("/careers#apply");await fill(page);await mode("reject");const before=await providerState();expect((await send(page)).status()).toBe(502);await preserved(page);
 const alert=form(page).getByRole("alert");await expect(alert).toBeFocused();await expect(alert).toContainText("couldn't send");
 await page.evaluate(()=>Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async v=>{window.__careerCopied=v;}}}));await form(page).getByRole("button",{name:"Copy application details",exact:true}).click();expect(await page.evaluate(()=>window.__careerCopied)).toContain("QA Fictional Applicant");
 await page.evaluate(()=>Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("denied");}}}));await form(page).getByRole("button",{name:"Copy application details",exact:true}).click();await expect(form(page).getByLabel("Application details to copy",{exact:true})).toBeFocused();expect(await form(page).getByLabel("Application details to copy",{exact:true}).evaluate(e=>e.selectionEnd-e.selectionStart===e.value.length)).toBe(true);
 const calls=(await providerState()).calls.length;await page.waitForTimeout(1000);expect((await providerState()).calls.length).toBe(calls);
 await page.route("**/api/career-application",r=>r.fulfill({status:429,contentType:"application/json",body:'{"ok":false}'}));expect((await send(page)).status()).toBe(429);await expect(alert).toContainText("too many recent applications");await preserved(page);expect((await providerState()).calls.length).toBe(calls);await page.unroute("**/api/career-application");
 await mode("lose-response");expect((await send(page)).status()).toBe(502);await expect(alert).toContainText("couldn't confirm");await preserved(page);const accepted=await providerState();expect(accepted.acceptedEmails).toBe(before.acceptedEmails+1);
 await mode("accept");expect((await send(page)).status()).toBe(200);await expect(form(page).getByRole("status")).toContainText("accepted for email delivery");const after=await providerState();expect(after.acceptedEmails).toBe(accepted.acceptedEmails);const pair=after.calls.slice(-2);expect(pair[0].key).toBe(pair[1].key);expect(pair[0].bodyHash).toBe(pair[1].bodyHash);
});

test("29 careers file correction/replacement, keyboard and script-failure contact fallback",async({page,browser})=>{
 const before=await providerState();await page.setViewportSize({width:320,height:1000});await page.goto("/careers#apply");await fill(page);
 await resume(page).setInputFiles({name:"not-a-resume.exe",mimeType:"application/octet-stream",buffer:Buffer.from("fixture")});await expect(form(page).getByRole("alert")).toContainText("PDF or DOCX");
 await resume(page).setInputFiles({name:"large.pdf",mimeType:"application/pdf",buffer:Buffer.alloc(3*1024*1024+1)});await expect(form(page).getByRole("alert")).toContainText("3 MB");
 await chooseResume(page,"pdf");await form(page).getByRole("button",{name:"Remove file",exact:true}).click();expect(await resume(page).evaluate(e=>e.files.length)).toBe(0);
 await chooseResume(page,"docx");await expect(form(page).getByText("Selected: resume.docx",{exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 await form(page).getByLabel("Full name *",{exact:true}).focus();await page.keyboard.press("Tab");await expect(form(page).getByLabel("Email *",{exact:true})).toBeFocused();
 for(const scripts of ["disabled","blocked"]){const c=await browser.newContext({baseURL:origin,javaScriptEnabled:scripts!=="disabled",viewport:{width:390,height:844},serviceWorkers:"block"});const g=await contain(c);try{if(scripts==="blocked")await c.route("**/*",async r=>{if(r.request().resourceType()==="script")await r.abort();else await r.fallback();});const p=await c.newPage();await p.goto("/careers#apply");await expect(button(p)).toBeDisabled();await expect(p.locator("#apply").getByRole("link",{name:"info@kbuiltco.com",exact:true})).toBeVisible();await expect(p.locator("#apply").getByText(/online form needs JavaScript/)).toBeVisible();expect(await form(p).getAttribute("method")).toBe("post");expect(new URL(p.url()).search).toBe("");expect(g.outbound).toEqual([]);}finally{await g.drain();await c.close();}}
 expect((await providerState()).calls.length).toBe(before.calls.length);
});
