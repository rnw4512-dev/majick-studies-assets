"""Reproducible static previews from the supplied meshes; never executes saved scripts."""
import bpy,sys,os
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
folder=args[0] if args else 'work/asset-renders';os.makedirs(folder,exist_ok=True)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=False;scene.cycles.device='CPU'
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.view_settings.view_transform='Standard';scene.view_settings.look='None';scene.view_settings.exposure=0;scene.view_settings.gamma=1
scene.render.resolution_x=256;scene.render.resolution_y=256;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
scene.world=bpy.data.worlds.new('Aetheria studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.55,.5,.6,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.4
meshes=[o for o in bpy.data.objects if o.type=='MESH']
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
kind='human' if any(o.name.startswith('Human') for o in meshes) else 'potion'
selected=[o for o in meshes if o.name.startswith('Human')] if kind=='human' else [bpy.data.objects['potionBottle'+str(i).zfill(2)] for i in range(1,6)]
colors=[(.35,.62,.72,1),(.65,.25,.39,1),(.3,.55,.38,1),(.62,.44,.2,1),(.48,.32,.65,1)]
camdata=bpy.data.cameras.new('Preview camera');camera=bpy.data.objects.new('Preview camera',camdata);scene.collection.objects.link(camera);scene.camera=camera;camdata.type='ORTHO'
lights=[]
for i,(energy,size) in enumerate([(40,3),(25,2)]):
 data=bpy.data.lights.new('Studio '+str(i),'AREA');data.energy=energy;data.shape='DISK';data.size=size
 obj=bpy.data.objects.new(data.name,data);scene.collection.objects.link(obj);lights.append(obj)
for i,obj in enumerate(selected):
 for other in meshes:other.hide_render=other!=obj
 points=[obj.matrix_world@Vector(c) for c in obj.bound_box];lo=Vector([min(p[j] for p in points) for j in range(3)]);hi=Vector([max(p[j] for p in points) for j in range(3)]);height=hi.z-lo.z
 target=(lo+hi)/2
 if kind=='human':target.z=lo.z+height*.88;camdata.ortho_scale=height*.4
 else:camdata.ortho_scale=height*1.35
 camera.location=target+Vector((height*.35,-height*2,height*.4));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
 for j,light in enumerate(lights):
  light.location=target+Vector(((-1 if j==0 else 1)*height,-height,height*1.8));light.rotation_euler=(target-light.location).to_track_quat('-Z','Y').to_euler()
 mat=bpy.data.materials.new('Aetheria derivative studio material');mat.diffuse_color=(.68,.57,.43,1) if kind=='human' else colors[i];mat.use_nodes=True
 bsdf=mat.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=mat.diffuse_color;bsdf.inputs['Roughness'].default_value=.42
 obj.data.materials.clear();obj.data.materials.append(mat)
 name=('human-female-study' if 'Female' in obj.name else 'human-male-study') if kind=='human' else 'potion-'+str(i+1)
 scene.render.filepath=folder+'/'+name+'.png';bpy.ops.render.render(write_still=True)
