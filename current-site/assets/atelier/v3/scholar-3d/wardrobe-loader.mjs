// Prototype; inject an existing GLTFLoader instance. No Three.js dependency at startup.
// Use only with the matching Quaternius 65-joint base and supplied manifest.
export async function createScholarWardrobe({loader, manifest, assetRoot, parent}) {
  const url = file => new URL(file, assetRoot).href;
  const base = (await loader.loadAsync(url(manifest.base))).scene;
  base.visible = false;
  let body; base.traverse(o => { if (o.isSkinnedMesh && !body) body = o; });
  if (!body) throw new Error('Missing source skeleton');
  const names = body.skeleton.bones.map(b => b.name);
  if (JSON.stringify(names) !== JSON.stringify(manifest.rig.jointNames)) throw new Error('Base rig mismatch');
  parent.add(base); base.updateMatrixWorld(true);
  const current = new Map(), generations = new Map(); let dead = false;
  function disposeMesh(mesh) { mesh.removeFromParent(); mesh.geometry?.dispose(); for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) m?.dispose(); }
  async function equip(slot, id) {
    if (dead) throw new Error('Wardrobe disposed');
    const entry = manifest.slots[slot]?.find(e => e.id === id);
    if (!entry) throw new Error('Unknown wardrobe item');
    if (current.get(slot)?.id === id) return;
    const generation = (generations.get(slot) || 0) + 1; generations.set(slot, generation);
    const loaded = (await loader.loadAsync(url(entry.file))).scene; loaded.updateMatrixWorld(true);
    const meshes = []; loaded.traverse(o => { if (o.isSkinnedMesh) meshes.push(o); });
    if (!meshes.length || meshes.some(m => JSON.stringify(m.skeleton.bones.map(b=>b.name)) !== JSON.stringify(names))) { meshes.forEach(disposeMesh); throw new Error('Wardrobe rig mismatch'); }
    if (dead || generations.get(slot) !== generation) { meshes.forEach(disposeMesh); return; }
    for (const m of meshes) { const bind = m.bindMatrix.clone(); base.attach(m); m.bind(body.skeleton, bind); m.frustumCulled = false; }
    const previous = current.get(slot); if (previous) previous.meshes.forEach(disposeMesh);
    current.set(slot, {id, meshes});
  }
  try { await Promise.all(Object.entries(manifest.default).map(([slot,id])=>equip(slot,id))); base.visible = true; }
  catch (e) { for (const v of current.values()) v.meshes.forEach(disposeMesh); base.removeFromParent(); throw e; }
  return {base,equip,dispose(){dead=true;for(const v of current.values())v.meshes.forEach(disposeMesh);current.clear();const textures=new Set();const mats=new Set();const geometries=new Set();base.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m){mats.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});for(const t of textures)t.dispose();for(const m of mats)m.dispose();for(const g of geometries)g.dispose();body.skeleton.dispose();base.removeFromParent();}};
}
