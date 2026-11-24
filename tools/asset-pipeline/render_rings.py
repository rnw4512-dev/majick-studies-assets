"""Render supplied Clint Bellanger ring meshes; invoke Blender with --disable-autoexec."""
import bpy,sys,os
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:];folder=args[0];os.makedirs(folder,exist_ok=True)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=False;scene.cycles.device='CPU';scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.resolution_x=160;scene.render.resolution_y=160;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.view_settings.view_transform='Standard'
meshes=[o for o in bpy.data.objects if o.type=='MESH']
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for m in bpy.data.materials:
 color=tuple(m.diffuse_color);m.use_nodes=True;n=m.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=color;n.inputs['Metallic'].default_value=.85 if any(k in m.name for k in ['Gold','Silver']) else .12;n.inputs['Roughness'].default_value=.24
scene.world=bpy.data.worlds.new('Ring studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.8,.78,.72,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.6
cd=bpy.data.cameras.new('Preview');camera=bpy.data.objects.new('Preview',cd);scene.collection.objects.link(camera);scene.camera=camera;cd.type='ORTHO'
lights=[]
for i in range(2):
 data=bpy.data.lights.new('Softbox'+str(i),'AREA');data.energy=550;data.size=4;obj=bpy.data.objects.new(data.name,data);scene.collection.objects.link(obj);lights.append(obj)
for obj in sorted(meshes,key=lambda x:x.name):
 for other in meshes:other.hide_render=other!=obj
 points=[obj.matrix_world@Vector(c) for c in obj.bound_box];lo=Vector([min(p[j] for p in points) for j in range(3)]);hi=Vector([max(p[j] for p in points) for j in range(3)]);target=(lo+hi)/2;size=max(hi-lo);cd.ortho_scale=size*1.3
 camera.location=target+Vector((size*2,-size*.9,size*.6));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
 for i,light in enumerate(lights):light.location=target+Vector((size*1.5,(-1 if i else 1)*size*2,size*2));light.rotation_euler=(target-light.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=folder+'/'+obj.name+'.png';bpy.ops.render.render(write_still=True)
