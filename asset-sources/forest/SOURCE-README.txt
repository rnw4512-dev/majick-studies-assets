FAIRY FOREST PACK
=================

Build an enchanted night-time forest: a gnarled ancient tree, a weeping glow willow and a tall slender fairy tree, a hollow fairy tree house with a wrap-around balcony and toadstool roof, a stump with a tiny fairy door, giant glowing mushrooms, a fairy ring, a moonwell of glowing water, a root bridge, crystal clusters, bellflowers, ferns, mossy logs and rocks. High-detail organic shapes with smooth shading and glowing details, made for cozy fantasy scenes with bloom.


QUICK START (DOWNLOAD & INSTALL)
--------------------------------
1. Unzip FairyForestPack.zip anywhere. Keep the folder structure: the meshes find
   their textures through ../../Textures/.
2. Pick your engine:
   Unity   : Drag the Meshes/FBX and Textures folders into your project's
             Assets folder, then follow "Unity" under ENGINE SETUP.
   Unreal  : Content Browser > Import > select the FBX files, then import the
             Textures folder. See "Unreal Engine" below.
   Godot 4 : Copy Meshes/GLB/FairyForestPack.glb into your project. It imports with
             materials ready to use.
   Blender : Open Blender/FairyForestPack.blend. To use pieces in other files, add
             the Blender folder in Preferences > File Paths > Asset Libraries.
3. Drag the pieces into your scene.


FOLDERS
-------
Meshes/FBX/   One FBX per asset, with simple collision (UCX_*). Unity / Unreal.
Meshes/GLB/   FairyForestPack.glb: every asset in one file, textures embedded.
Textures/     One folder per material.
Blender/      FairyForestPack.blend (Blender 5.3)
                Scene "Assets" : every asset laid out, with lights and cameras
                Scene "Demo"   : example scene built from the pack
              Assets are marked for the Asset Browser (catalog "Fairy Forest Pack");
              keep blender_assets.cats.txt next to the .blend.
Previews/     Store images, wireframe and texture sheet.


ASSETS                              Tris   Size (m, W x D x H)   Materials
------
Trees
  SM_Fairy_Tree_Ancient           30081    6.9 x 8.1 x  9.3   Bark Moss Trim Foliage Stem
  SM_Fairy_Tree_Willow            24052    8.6 x 7.9 x  6.6   Bark Moss Foliage Trim Stem
  SM_Fairy_Tree_Tall              12132    4.4 x 4.7 x  9.8   Bark Moss Foliage Trim Stem
Buildings
  SM_Fairy_Tree_House             24793    6.1 x 6.1 x  8.2   Bark Moss Wood Trim Stone Stem Cap
  SM_Fairy_Stump_Door              9742    2.8 x 2.5 x  1.8   Bark Stem Moss Wood Trim Stone
Mushrooms
  SM_Fairy_Mushroom_Giant          7816    4.7 x 4.8 x  6.5   Stem Cap Trim Moss
  SM_Fairy_Mushroom_Cluster       11880    1.4 x 1.2 x  1.2   Moss Trim
  SM_Fairy_Ring                   10040    3.8 x 3.6 x  1.4   Trim Stone Moss
Props
  SM_Fairy_Moonwell                4897    3.7 x 3.4 x  0.9   Stone Trim
  SM_Fairy_Root_Bridge             7282    6.2 x 2.0 x  2.8   Wood Bark Trim
  SM_Fairy_Lantern_Crook           1717    1.3 x 0.9 x  2.6   Bark Trim
  SM_Fairy_Path_Stone_Glow          424    0.9 x 0.9 x  0.1   Stone Trim Moss
  SM_Fairy_Crystal_Cluster          917    1.3 x 1.0 x  0.7   Stone Trim Moss
Nature
  SM_Fairy_Log_Mossy               5352    3.5 x 1.0 x  1.1   Bark Moss Stem Trim
  SM_Fairy_Fern                    3483    1.5 x 1.4 x  0.6   Trim
  SM_Fairy_Flowers_Bell            4583    0.9 x 1.0 x  0.6   Trim
  SM_Fairy_Rock_Mossy_01           1621    3.6 x 2.7 x  1.6   Stone Moss Trim
  SM_Fairy_Rock_Mossy_02            853    2.2 x 1.5 x  0.7   Stone Moss Trim

18 assets, 161,665 triangles in total. All meshes are triangulated, smooth shaded with bevelled edges, real-world scale (1 unit = 1 m), pivot at ground level (or at the
hanging point for hanging pieces), front facing -Y in Blender.
No rigging or animation.


USING THE PIECES
----------------
- Buildings face -Y (door side). Pivots are at the centre of the base.
- Mushroom caps (Cap material) have glowing pale spots; the moss has faint glowing specks (both via the Emissive map).
- Leaves, petals and fern leaflets are real geometry modelled double-sided, so no alpha cutout is needed.
- SM_Fairy_Root_Bridge spans 4.4 m along X (about 5.8 m including the roots that dig into the ground).
- SM_Fairy_Path_Stone_Glow is meant to be repeated along paths about 1.2 m apart.
- Plants, flowers, ferns and the fairy ring have no collision (decoration).


MATERIALS & TEXTURES
--------------------
Tiling materials (2048 x 2048, one tile = 2 x 2 m):
  M_Fairy_Bark  M_Fairy_Cap  M_Fairy_Stem  M_Fairy_Moss  M_Fairy_Stone  M_Fairy_Wood  M_Fairy_Foliage
  Files per material:
    _BaseColor.png           sRGB
    _Normal.png              Linear, OpenGL (Y+): Unity, Godot, Blender
    _Normal_DirectX.png      Linear, DirectX (Y-): Unreal
    _ORM.png                 Linear, R = AO, G = Roughness, B = Metallic
    _MetallicSmoothness.png  Linear, Unity (RGB = Metallic, A = Smoothness)
    _Emissive.png            sRGB (Cap, Moss only)

Props sheet M_Fairy_Trim (2048 x 2048, 4 x 4 detailed cells): leaves, glowing petals, window and lantern glow, door wood, iron, crystals, glowing water, fireflies, toadstool caps and gills.
  _BaseColor, _Normal, _Normal_DirectX, _ORM, _MetallicSmoothness, _Emissive (sRGB).


ENGINE SETUP
------------
Unity (URP / HDRP / Built-in)
  Per material: Base Map = BaseColor, Normal Map = Normal, Metallic =
  MetallicSmoothness (Source: Metallic Alpha), Occlusion = ORM. Where an
  Emissive map exists, enable Emission with it (intensity 2-5). UCX_* objects
  are collision: remove their renderer and use them as convex Mesh Colliders.

Unreal Engine
  Import the FBX files (UCX_* become simple collision automatically) and the
  textures. Use Normal_DirectX; set ORM and MetallicSmoothness to "Masks",
  sRGB off. Wire ORM R/G/B to AO / Roughness / Metallic and Emissive x 3 to
  Emissive Color.

Godot 4
  Drop Meshes/GLB/FairyForestPack.glb into the project. Materials and emission come
  in automatically; each asset is its own node.


LIGHTING TIP
------------
Glowing parts are emissive. For them to light their surroundings, add small
point lights next to them; the .blend scenes show ready-made placements.


LICENSE
-------
See the license terms of the marketplace you purchased this pack from.
