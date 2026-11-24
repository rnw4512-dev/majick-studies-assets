'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(process.argv[2]||'current-site');const data=JSON.parse(fs.readFileSync(path.join(root,'assets/licensed/asset-manifest.json')));
for(const item of data.assets){const raw=fs.readFileSync(path.join(root,item.path));assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),item.sha256,item.path);assert(['CC0-1.0','CC-BY-3.0'].includes(item.license));assert(item.author&&item.source.startsWith('https://opengameart.org/'));}
for(const name of ['light','nature','arcane','projectile']){
 const raw=fs.readFileSync(path.join(root,'assets/licensed/effects',name+'.webp'));assert.equal(raw.toString('ascii',0,4),'RIFF');let found=false;
 for(let pos=12;pos+8<=raw.length;){const id=raw.toString('ascii',pos,pos+4),size=raw.readUInt32LE(pos+4);if(id==='ANIM'){assert.equal(raw.readUInt16LE(pos+12),1,'One play only: '+name);found=true}pos+=8+size+(size%2)}
 assert(found,'Animation chunk missing: '+name);
 const poster=fs.readFileSync(path.join(root,'assets/licensed/effects',name+'-poster.webp'));assert(!poster.includes(Buffer.from('ANIM')),'Poster must be static');
}
assert.equal(data.assets.filter(x=>x.path.includes('/milestones/')&&x.path.endsWith('.png')).length,8);
assert.equal(data.assets.filter(x=>/\/audio\/magical_[1-5]\.ogg$/.test(x.path)).length,5);
assert.equal(data.assets.filter(x=>x.path.includes('/music/')&&x.path.endsWith('.ogg')).length,6);
assert.equal(data.assets.filter(x=>x.path.includes('/rings/')&&x.license==='CC-BY-3.0'&&x.author==='Clint Bellanger').length,10);
assert.equal(data.assets.filter(x=>x.path.includes('/gems/')).length,4);
assert.equal(data.assets.filter(x=>x.path.includes('/crystals/')).length,3);
assert.equal(data.assets.filter(x=>x.path.includes('/plants/')&&x.path.endsWith('.webp')).length,2);
assert(fs.readFileSync(path.join(root,'assets/licensed/plants/LICENSE.txt'),'utf8').includes('CC0 1.0'));
assert(data.excluded.includes('WomanBody13.blend'));assert(data.pending.some(x=>x.name==='Blue-white Poof'));
console.log('PASS approved source asset hashes, licenses, 8 icons, 5 sounds, finite WebP animations, reduced-motion posters and excluded-art gate');
