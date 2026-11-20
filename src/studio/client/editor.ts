import type { Collection, ScriptDraft, Snapshot } from '../model';

type Listed = {id:string;slug:string;title:string;state:string};
type Value = string|boolean|string[];
type RecordData = {title:string;slug:string;summary:string;state?:string;visibility?:string; [key:string]:unknown;
  seo:{title:string;description:string;indexable:boolean}};
type RecordResponse = {data:RecordData;body:string;sourceFile:string;revision:string;draft:Snapshot|ScriptDraft|null;draftRevision:string|null;
  publicScript:Snapshot['excerpt']|null; publicScriptRevision:string|null; publicScriptFile?:string};
const studio = document.querySelector<HTMLElement>('[data-studio]')!;
const $ = <T extends Element>(selector:string) => studio.querySelector<T>(selector)!;
const group = $<HTMLSelectElement>('#studio-group');
const record = $<HTMLSelectElement>('#studio-record');
const form = $<HTMLFormElement>('#studio-form');
const fields = $<HTMLElement>('#studio-fields');
const draftButton = $<HTMLButtonElement>('#save-draft');
const applyButton = $<HTMLButtonElement>('#apply-record');
const discardButton = $<HTMLButtonElement>('#discard-buffer');
const selectionKey = 'dead-interval:studio:selection';
const previewMode = $<HTMLSelectElement>('#preview-mode');
const frame = $<HTMLIFrameElement>('iframe');
const review = $<HTMLDialogElement>('#studio-review');
const status = $<HTMLElement>('#studio-status');
const previewStatus = $<HTMLElement>('#preview-status');
const controls = new Map<string,HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>();
let archive: {cases:Listed[];entities:Listed[];signals:{id:string;caseId:string;title:string}[]};
let entry:RecordResponse|undefined;
let target:{collection:Collection; id:string}|undefined;
let dirty=false;
let saving=false;
let previewTimer=0;
let request=0;
let previewAbort:AbortController|undefined;

async function api<T>(route:string,data?:unknown,signal?:AbortSignal):Promise<T> {
  const response=await fetch('/studio/api/'+route+'/',{
    signal, ...(data===undefined ? {} : {method:'POST',headers:{
      'content-type':'application/json','x-studio-token':studio.dataset.nonce!,
    },body:JSON.stringify(data)}),
  });
  const value=await response.json();
  if (!response.ok) throw new Error(value.error??'Studio không thể hoàn thành yêu cầu.');
  return value as T;
}
function field(parent:HTMLElement,key:string,label:string,value:Value, kind:'text'|'long'|'lines'|'check'|'kind'='text') {
  const wrapper=document.createElement('label');
  wrapper.textContent=label;
  let input:HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement;
  if (kind==='long'||kind==='lines') {
    input=document.createElement('textarea');
    input.rows=kind==='long'?7:3;
  } else if (kind==='kind') {
    input=document.createElement('select');
    for (const option of ['excerpt','script','transcript']) input.add(new Option(option,option));
  } else {
    input=document.createElement('input');
    input.type=kind==='check'?'checkbox':'text';
    if (kind==='check') wrapper.className='check-field';
  }
  input.dataset.key=key;
  if (kind==='check'&&input instanceof HTMLInputElement) input.checked=Boolean(value);
  else input.value=Array.isArray(value)?value.join('\n'):String(value);
  wrapper.append(input);
  parent.append(wrapper);
  controls.set(key,input);
}
function section(label:string) {
  const panel=document.createElement('details');
  const heading=document.createElement('summary');
  heading.textContent=label;
  panel.append(heading);
  fields.append(panel);
  return panel;
}
function text(key:string) {return controls.get(key)?.value??'';}
function lines(key:string) {return text(key).split(/\r?\n/).map(line=>line.trim()).filter(Boolean);}
function snapshot():Snapshot {
  const current=target!;
  const pairs:Record<string,unknown>={};
  if (current.collection!=='scripts') for (const [key,input] of controls) {
    if (key==='bodyMarkdown') continue;
    pairs[key]=input instanceof HTMLInputElement&&input.type==='checkbox' ? input.checked
      : ['topics','observations','entityIds','signalIds'].includes(key)?lines(key):input.value;
  }
  return {...current,fields:pairs,bodyMarkdown:text('bodyMarkdown'),fullPreview:previewMode.value==='full',
    ...(current.collection==='scripts'?{excerpt:{title:text('excerptTitle'),bodyMarkdown:text('excerptBody'),
      kind:text('excerptKind') as 'excerpt'|'script'|'transcript'}}:{})};
}
function scriptDraft(current:Snapshot):ScriptDraft {
  const prior=entry?.draft;
  const base={schemaVersion:1 as const,id:current.id,caseId:current.id,workingTitle:text('workingTitle'),
    updatedAt:new Date().toISOString(),authorNotes:text('authorNotes'),excerptCandidate:current.excerpt};
  return prior&&'format' in prior&&prior.format==='scenes' ? {...base,format:'scenes',scenes:prior.scenes}
    : {...base,format:'markdown',bodyMarkdown:current.bodyMarkdown};
}
const bufferKey = () => 'dead-interval:studio:'+target!.collection+':'+target!.id;
function remember() {
  if (!target||!entry) return;
  try { sessionStorage.setItem(bufferKey(),JSON.stringify({revision:entry.revision,
    draftRevision:entry.draftRevision, values:[...controls].map(([key,input])=>[key,input.value,
      input instanceof HTMLInputElement&&input.type==='checkbox' ? input.checked : null])})); } catch { /* storage may be disabled */ }
}
function forgetting() {try {sessionStorage.removeItem(bufferKey());} catch { /* optional recovery */ }}
function restoreBuffer() {
  try {
    const stored=sessionStorage.getItem(bufferKey());
    if (!stored) return false;
    const buffer=JSON.parse(stored);
    for(const [key,value,checked] of buffer.values) {
      const input=controls.get(key);
      if (!input) continue;
      input.value=value;
      if (typeof checked==='boolean'&&input instanceof HTMLInputElement) input.checked=checked;
    }
    if (entry && (entry.revision!==buffer.revision||entry.draftRevision!==buffer.draftRevision)) {
      entry.revision=buffer.revision;
      entry.draftRevision=buffer.draftRevision;
      conflict=true;
    }
    return true;
  } catch {return false;}
}
let conflict=false;
function buildFields(value:RecordResponse) {
  fields.replaceChildren();
  controls.clear();
  const item=value.data;
  if(target!.collection==='scripts') {
    const draft=value.draft&&'format' in value.draft?value.draft:undefined;
    const excerpt=draft?.excerptCandidate??value.publicScript;
    field(fields,'workingTitle','Tên bản nháp',draft?.workingTitle??item.title);
    const body=draft?.format==='scenes'?draft.scenes.map(scene=>scene.narrationMarkdown).join('\n\n'):draft?.bodyMarkdown;
    field(fields,'bodyMarkdown','Kịch bản nội bộ · Markdown',body??'','long');
    if (draft?.format==='scenes') {
      const input=controls.get('bodyMarkdown')!;
      input.setAttribute('readonly','');
      input.insertAdjacentText('afterend','Bản phân cảnh xem được ở đây. Nội dung cảnh được giữ trong JSON.');
    }
    field(section('Ghi chú nội bộ'),'authorNotes','Ghi chú',draft?.authorNotes??'','long');
    const publication=section('Trích đoạn đã chọn để xem trước hoặc công bố');
    publication.open=true;
    field(publication,'excerptTitle','Tiêu đề trích đoạn',excerpt?.title??'');
    field(publication,'excerptKind','Loại trích đoạn',excerpt?.kind??'excerpt','kind');
    field(publication,'excerptBody','Trích đoạn · Markdown',excerpt?.bodyMarkdown??'','long');
  } else {
    const draft=value.draft&&'fields' in value.draft?value.draft:undefined;
    const previous=(key:string,fallback:Value)=>(draft?.fields[key]??fallback) as Value;
    field(fields,'title','Tiêu đề',previous('title',item.title));
    field(fields,'summary','Tóm tắt',previous('summary',item.summary),'long');
    const locked=item.state==='sealed'||item.visibility==='redacted';
    field(fields,'bodyMarkdown',locked?'Thân bài nội bộ · Markdown':'Thân bài · Markdown',draft?.bodyMarkdown??value.body,'long');
    const variants:Record<string,string>={embargoMessage:'Thông báo khóa',closingQuestion:'Câu hỏi kết',
      designation:'Định danh',publicObservation:'Quan sát công khai',observations:'Quan sát, mỗi dòng một mục',
      topics:'Chủ đề, mỗi dòng một mục', entityIds:'ID thực thể, mỗi dòng một mục', signalIds:'ID tín hiệu, mỗi dòng một mục'};
    const advanced=section('Metadata hồ sơ và SEO');
    for (const [key,label] of Object.entries(variants)) if (key in item) {
      const original=item[key] as Value;
      field(['embargoMessage','closingQuestion','designation','publicObservation','observations'].includes(key)?fields:advanced,
        key,label,previous(key,original),Array.isArray(original)?'lines':'text');
    }
    field(advanced,'seoTitle','Tiêu đề SEO',previous('seoTitle',item.seo.title));
    field(advanced,'seoDescription','Mô tả SEO',previous('seoDescription',item.seo.description),'long');
    if (!locked) field(advanced,'seoIndexable','Cho phép lập chỉ mục',previous('seoIndexable',item.seo.indexable),'check');
    if (target!.collection==='cases') {
      const hint=document.createElement('p');
      hint.className='notice';
      hint.textContent='Thực thể: '+archive.entities.map(x=>x.id+' '+x.title).join(' · ')+'\nTín hiệu: '+
        archive.signals.filter(x=>x.caseId===target!.id).map(x=>x.id+' '+x.title).join(' · ');
      advanced.append(hint);
    }
  }
}
function schedulePreview(delay=300) {
  window.clearTimeout(previewTimer);
  previewAbort?.abort();
  const sequence=++request;
  if (!target||!entry) return;
  previewTimer=window.setTimeout(async ()=>{
    previewAbort=new AbortController();
    previewStatus.textContent='Đang cập nhật xem trước…';
    try {
      const result=await api<{url:string}>('preview',snapshot(),previewAbort.signal);
      if (sequence!==request) return;
      frame.src=result.url;
      previewStatus.textContent=target?.collection==='scripts'?'Trích đoạn đang soạn · Chỉ xem trước local'
        :previewMode.value==='full'?'Bản đầy đủ · Chỉ local':'Dữ liệu đang soạn · Chưa ghi';
    } catch(e) {if(sequence===request) previewStatus.textContent='Giữ bản xem gần nhất. '+(e as Error).message;}
  },delay);
}
function setButtons() {
  discardButton.disabled=saving||!entry||!dirty;
  draftButton.disabled=saving||!entry||conflict;
  applyButton.disabled=saving||!entry||conflict||(target?.collection==='scripts'&&entry.data.state!=='released');
}
function listOptions(selected?:string) {
  const source=group.value==='entities'?archive.entities:archive.cases;
  record.replaceChildren(...source.map(item=>new Option(item.title+' · '+item.state,item.id,item.id===selected,item.id===selected)));
}
async function loadSelection() {
  const previous=target;
  if (saving) {
    if (previous) { group.value=previous.collection; listOptions(previous.id); }
    return;
  }
  dirty=false;
  conflict=false;
  entry=undefined;
  fields.replaceChildren();
  controls.clear();
  const selected={collection:group.value as Collection,id:record.value};
  target=selected;
  try { sessionStorage.setItem(selectionKey,JSON.stringify(selected)); } catch { /* optional recovery */ }
  setButtons();
  schedulePreview();
  frame.removeAttribute('src');
  status.textContent='Đang tải nội dung…';
  try {
    const value=await api<RecordResponse>('records/'+selected.collection+'/'+selected.id);
    if (selected!==target) return;
    entry=value;
    buildFields(value);
    dirty=restoreBuffer();
    status.textContent=conflict?'Tệp đã thay đổi. Sao chép nội dung đang gõ trước khi tải lại mục.'
      :dirty?'Đã khôi phục nội dung chưa lưu.':'Đã tải từ nguồn.';
    const name=selected.collection==='scripts'?'Kịch bản · '+(value.data.state??''):value.data.state??value.data.visibility;
    $<HTMLElement>('#studio-meta').textContent=selected.id+' · '+name;
    const link=$<HTMLAnchorElement>('#open-record');
    link.href='/'+(selected.collection==='entities'?'entities':'cases')+'/'+value.data.slug+'/';
    link.hidden=false;
    applyButton.textContent=selected.collection==='scripts'?'Ghi trích đoạn công khai':'Ghi vào kho công khai';
    if (selected.collection==='scripts'&&value.data.state!=='released') status.textContent+=' Trích đoạn có thể xem trước tại đây.';
    setButtons();
    schedulePreview(0);
  } catch(e) {if(selected===target) status.textContent=(e as Error).message;}
}
async function confirmWrite(current:Snapshot) {
  const value=entry!;
  const script=current.collection==='scripts';
  const locked=value.data.state==='sealed'||value.data.visibility==='redacted';
  const targetPath=script ? 'src/content/scripts/'+(value.publicScriptFile??current.id)+'.md'
    : 'src/content/'+current.collection+'/'+value.sourceFile+'.md';
  $<HTMLElement>('#review-path').textContent=targetPath;
  const before: Record<string, unknown> = {...value.data, seoTitle:value.data.seo.title,
    seoDescription:value.data.seo.description, seoIndexable:value.data.seo.indexable};
  const differences = Object.fromEntries(Object.entries(current.fields).filter(([key,after])=>
    JSON.stringify(before[key])!==JSON.stringify(after)).map(([key,after])=>[key,{trước:before[key],sau:after}]));
  const changes=script ? {trước:value.publicScript,sau:current.excerpt} : {
    ...differences, ...(!locked && value.body!==current.bodyMarkdown ? {Markdown:{trước:value.body,sau:current.bodyMarkdown}} : {}),
  };
  $<HTMLElement>('#review-changes').textContent=JSON.stringify(changes,null,2);
  review.returnValue='cancel';
  review.showModal();
  await new Promise<void>(resolve=>review.addEventListener('close',()=>resolve(),{once:true}));
  return review.returnValue==='accept';
}
async function save(draft:boolean) {
  if (!entry||!target||saving||conflict) return;
  const current=snapshot();
  const value=entry;
  if (!draft&&!(await confirmWrite(current))) return;
  saving=true;
  fields.inert=true;
  setButtons();
  status.textContent='Đang lưu…';
  const script=current.collection==='scripts';
  const locked=value.data.state==='sealed'||value.data.visibility==='redacted';
  try {
    const result=await api<{revision?:string;draftRevision?:string;publicScriptRevision?:string}>('save',{
      intent:draft?'saveDraft':script?'publishExcerpt':'applyRecord',revision:value.revision,
      draftRevision:value.draftRevision,publicScriptRevision:value.publicScriptRevision,
      snapshot:draft?current:{...current,fullPreview:false,bodyMarkdown:script||locked?'':current.bodyMarkdown},
      ...(draft&&script?{scriptDraft:scriptDraft(current)}:{}),
    });
    if (result.draftRevision) {
      value.draftRevision=result.draftRevision;
      value.draft=script?scriptDraft(current):current;
    }
    if (result.revision) {
      value.revision=result.revision;
      const {seoTitle,seoDescription,seoIndexable,...patch}=current.fields;
      Object.assign(value.data,patch);
      if (typeof seoTitle==='string') value.data.seo.title=seoTitle;
      if (typeof seoDescription==='string') value.data.seo.description=seoDescription;
      if (typeof seoIndexable==='boolean') value.data.seo.indexable=seoIndexable;
      if (!locked) value.body=current.bodyMarkdown;
    }
    if (result.publicScriptRevision) {value.publicScriptRevision=result.publicScriptRevision;value.publicScript=current.excerpt??null;}
    dirty=!draft&&((script&&!!(text('bodyMarkdown').trim()||text('authorNotes').trim()))||(locked&&!!current.bodyMarkdown.trim()));
    if (dirty) remember(); else forgetting();
    status.textContent=dirty?'Đã ghi phần công khai. Nội dung nội bộ đang gõ có thể lưu thành bản nháp.':'Đã lưu vào tệp.';
    schedulePreview(0);
  } catch(e) {status.textContent=(e as Error).message;}
  finally {saving=false;fields.inert=false;setButtons();}
}
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('input',()=>{dirty=true;remember();setButtons();status.textContent='Chưa lưu';schedulePreview();});
group.addEventListener('change',()=>{if(archive){listOptions();void loadSelection();}});
record.addEventListener('change',()=>void loadSelection());
previewMode.addEventListener('change',()=>schedulePreview(0));
$<HTMLSelectElement>('#preview-width').addEventListener('change',event=>frame.classList.toggle('phone',(event.target as HTMLSelectElement).value==='phone'));
draftButton.addEventListener('click',()=>void save(true));
applyButton.addEventListener('click',()=>void save(false));
discardButton.addEventListener('click',()=>{
  if (target && confirm('Bỏ phần chỉnh sửa chưa lưu của mục này?')) {forgetting();void loadSelection();}
});
window.addEventListener('beforeunload',event=>{if(dirty) event.preventDefault();});
void api<typeof archive>('records').then(value=>{
  archive=value;
  let selectedId: string|undefined;
  try {
    const previous=JSON.parse(sessionStorage.getItem(selectionKey)??'null');
    if (previous && ['cases','entities','scripts'].includes(previous.collection)) {
      group.value=previous.collection;
      selectedId=previous.id;
    }
  } catch { /* optional recovery */ }
  listOptions(selectedId);
  return loadSelection();
})
  .catch(e=>{status.textContent=(e as Error).message;});
