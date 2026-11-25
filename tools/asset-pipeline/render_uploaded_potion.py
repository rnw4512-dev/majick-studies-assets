"""Render OwlishMedia's CC0 FBX using the supplied painted color/emission textures."""
import bpy,sys,os
from mathutils import Vector
source,out=sys.argv[sys.argv.index('--')+1:];os.makedirs(out,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.fbx(filepath=os.path.join(source,'Potion_1.fbx'))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];print('POTION MESHES',[(o.name,tuple(o.dimensions)) for o in meshes])
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=False;scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.resolution_x=192;scene.render.resolution_y=192;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.view_settings.view_transform='AgX'
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.69,.8,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.5
points=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box];lo=Vector([min(v[j] for v in points) for j in range(3)]);hi=Vector([max(v[j] for v in points) for j in range(3)]);target=(lo+hi)/2;size=max(hi-lo)
cd=bpy.data.cameras.new('Studio camera');cam=bpy.data.objects.new('Studio camera',cd);scene.collection.objects.link(cam);scene.camera=cam;cd.type='ORTHO';cd.ortho_scale=size*1.25;cam.location=target+Vector((size*2,-size*4,size*1.5));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
for i,offset in enumerate([(2,-3,4),(-3,-1,2)]):
 d=bpy.data.lights.new('Softbox '+str(i),'AREA');d.energy=250*size*size;d.size=size*3;o=bpy.data.objects.new(d.name,d);scene.collection.objects.link(o);o.location=target+Vector(offset)*size;o.rotation_euler=(target-o.location).to_track_quat('-Z','Y').to_euler()
for color in ['Purple','Aqua','Green','Orange','Red']:
 mat=bpy.data.materials.new('Original '+color+' painted texture');mat.use_nodes=True;n=mat.node_tree.nodes;links=mat.node_tree.links;shader=n.get('Principled BSDF');shader.inputs['Roughness'].default_value=.55
 tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(os.path.join(source,'tex','Potion_1_Potion1_'+color+'_AlbedoTransparency.png'));links.new(tex.outputs['Color'],shader.inputs['Base Color']);links.new(tex.outputs['Alpha'],shader.inputs['Alpha'])
 glow=n.new('ShaderNodeTexImage');glow.image=bpy.data.images.load(os.path.join(source,'tex','Potion_1_Potion1_'+color+'_Emission.png'));links.new(glow.outputs['Color'],shader.inputs['Emission Color']);shader.inputs['Emission Strength'].default_value=.3
 for o in meshes:o.data.materials.clear();o.data.materials.append(mat)
 scene.render.filepath=os.path.join(out,color.lower()+'.png');bpy.ops.render.render(write_still=True)
