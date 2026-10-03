(()=>{
'use strict';
const VERSION='3.3.72';
const STATUSES={
 'needs-reference-check':{label:'Needs Reference Check',className:'pending',trusted:false},
 'verified-fact':{label:'Verified Fact',className:'verified',trusted:true},
 'corroborated':{label:'Corroborated',className:'verified',trusted:true},
 'attributed-opinion':{label:'Attributed Opinion',className:'opinion',trusted:false},
 'disputed':{label:'Disputed / Check',className:'disputed',trusted:false},
 'rejected':{label:'Not Trusted',className:'rejected',trusted:false}
};
function normalize(row){
 row=row||{};
 const p=Object.assign({
   claimType:'mixed',submittedSourceKind:'user-material',authorOrOrg:'',reference:'',sourceDate:'',
   verificationStatus:'needs-reference-check',verificationVerdict:null,reviewedAt:null,reviewedBy:null,citations:[],notes:''
 },row.provenance||{});
 if(!STATUSES[p.verificationStatus])p.verificationStatus='needs-reference-check';
 p.citations=Array.isArray(p.citations)?p.citations:[];
 return p;
}
function status(row){const p=normalize(row);return STATUSES[p.verificationStatus]}
function canPromote(row){return !!status(row).trusted}
function isAttributedOpinion(row){return normalize(row).verificationStatus==='attributed-opinion'}
function citationCount(row){
 const p=normalize(row);
 const refs=new Set((p.citations||[]).map(c=>String(c?.url||c?.reference||c?.title||'').trim()).filter(Boolean));
 if(p.reference)refs.add(String(p.reference).trim());
 return refs.size;
}
function validateReview(row,next){
 const status=String(next?.verificationStatus||'needs-reference-check');
 const cites=Array.isArray(next?.citations)?next.citations:normalize(row).citations;
 const reference=String(next?.reference??normalize(row).reference??'').trim();
 const author=String(next?.authorOrOrg??normalize(row).authorOrOrg??'').trim();
 if((status==='verified-fact'||status==='corroborated')&&!reference&&!cites.length){
   return {ok:false,reason:'Verified factual content requires at least one recorded source or citation.'};
 }
 if(status==='attributed-opinion'&&!author){
   return {ok:false,reason:'Attributed opinion requires the author, organization, or speaker being credited.'};
 }
 return {ok:true};
}
function applyReview(row,next={}){
 const check=validateReview(row,next);if(!check.ok)return check;
 row.provenance=Object.assign(normalize(row),next,{
   reviewedAt:next.reviewedAt||new Date().toISOString()
 });
 return {ok:true,provenance:row.provenance};
}
function describe(row){
 const p=normalize(row),s=STATUSES[p.verificationStatus];
 return {status:p.verificationStatus,label:s.label,trusted:s.trusted,claimType:p.claimType,sourceKind:p.submittedSourceKind,authorOrOrg:p.authorOrOrg,reference:p.reference,sourceDate:p.sourceDate,citationCount:citationCount(row),verdict:p.verificationVerdict,notes:p.notes};
}
window.MajickSourceProvenance={VERSION,STATUSES,normalize,status,canPromote,isAttributedOpinion,citationCount,validateReview,applyReview,describe};
})();