"""Static derivatives of the supplied CC0 plant meshes and matching painted textures."""
import bpy,sys,os
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:];source,folder=args;os.makedirs(folder,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=False;scene.cycles.device='CPU';scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.resolution_x=160;scene.render.resolution_y=160;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.view_settings.view_transform='Standard'
scene.world=bpy.data.worlds.new('Herbarium studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.85,.85,.8,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.8
cd=bpy.data.cameras.new('Preview');camera=bpy.data.objects.new('Preview',cd);scene.collection.objects.link(camera);scene.camera=camera;cd.type='ORTHO'
lightdata=bpy.data.lights.new('Softbox','AREA');lightdata.energy=600;lightdata.size=5;light=bpy.data.objects.new('Softbox',lightdata);scene.collection.objects.link(light)
for mesh,texture,name in [('HP3_flower4','HP3_flower','flowers'),('HP3_bush014','HP3_bush01','shrub')]:
 for obj in list(bpy.data.objects):
  if obj.type=='MESH':bpy.data.objects.remove(obj,do_unlink=True)
 bpy.ops.wm.obj_import(filepath=source+'/OBJ/'+mesh+'.obj',forward_axis='NEGATIVE_Z',up_axis='Y')
 objects=[o for o in bpy.data.objects if o.type=='MESH'];points=[]
 mat=bpy.data.materials.new(name);mat.use_nodes=True;nodes=mat.node_tree.nodes;bsdf=nodes.get('Principled BSDF');bsdf.inputs['Roughness'].default_value=.85;tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(source+'/Textures/'+texture+'.tga');mat.node_tree.links.new(tex.outputs['Color'],bsdf.inputs['Base Color']);mat.node_tree.links.new(tex.outputs['Alpha'],bsdf.inputs['Alpha'])
 for o in objects:o.data.materials.clear();o.data.materials.append(mat);points.extend(o.matrix_world@Vector(c) for c in o.bound_box)
 lo=Vector([min(p[j] for p in points) for j in range(3)]);hi=Vector([max(p[j] for p in points) for j in range(3)]);target=(lo+hi)/2;size=max(hi-lo);cd.ortho_scale=size*1.3;camera.location=target+Vector((size*.25,-size*2,size*.3));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler();light.location=target+Vector((size,-size,size*2));light.rotation_euler=(target-light.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=folder+'/'+name+'.png';bpy.ops.render.render(write_still=True)
