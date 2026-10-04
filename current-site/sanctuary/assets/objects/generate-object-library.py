from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import json, hashlib, math, sys

# Generates starter transparent WebP art ONLY when a manifest-listed file is missing.
# Uploaded final art always wins. This file never reads or modifies Guardian motion art.
args = sys.argv[1:]
root_arg = next((a for a in args if not a.startswith('--')), None)
root = Path(root_arg) if root_arg else Path(__file__).parent
generate_all = '--all' in args
manifest_path = root / "objects-manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
root.mkdir(parents=True, exist_ok=True)

W = 256
OUTLINE = (28, 22, 46, 235)
GOLD = (220, 180, 85, 255)

def glow(img, xy, radius, color, alpha=75):
    layer = Image.new("RGBA", img.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    x,y = xy
    d.ellipse((x-radius,y-radius,x+radius,y+radius), fill=(color[0],color[1],color[2],alpha))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(max(1, radius//2))))

def palette(name):
    h=int(hashlib.md5(name.encode()).hexdigest()[:6],16)
    raw=((h>>16)&255,(h>>8)&255,h&255)
    c1=tuple(70+(v%140) for v in raw)
    c2=tuple(min(245,v+50) for v in c1)
    return c1,c2

def draw_asset(filename, dest):
    c1,c2=palette(filename)
    img=Image.new("RGBA",(W,W),(0,0,0,0))
    d=ImageDraw.Draw(img)
    glow(img,(128,130),76,c1)
    d.ellipse((52,205,204,230), fill=(20,15,35,70))
    n=filename.lower()

    def rect(box, fill, rad=0, w=4):
        if rad: d.rounded_rectangle(box,rad,fill=fill,outline=OUTLINE,width=w)
        else: d.rectangle(box,fill=fill,outline=OUTLINE,width=w)

    if any(k in n for k in ["book","lectern","stacks","scroll","journal"]):
        rect((70,130,186,184),(92,60,126,255),10)
        rect((76,111,180,147),(135,85,160,255),8)
        d.line((128,112,128,146),fill=GOLD,width=3)
        if "lectern" in n:
            rect((117,147,139,211),(86,59,47,255),4)
            d.polygon([(92,211),(164,211),(150,226),(106,226)],fill=(86,59,47,255),outline=OUTLINE)
    elif any(k in n for k in ["desk","table","board"]):
        d.polygon([(62,130),(170,112),(202,142),(92,161)],fill=(100,65,45,255),outline=OUTLINE)
        rect((84,156,98,218),(82,52,40,255),3); rect((176,144,190,207),(82,52,40,255),3)
    elif "telescope" in n:
        d.line((110,112,163,82),fill=(80,68,110,255),width=20)
        d.ellipse((150,67,184,95),fill=c2+(255,),outline=OUTLINE,width=4)
        d.line((128,125,101,211),fill=GOLD,width=6); d.line((128,125,153,211),fill=GOLD,width=6)
    elif any(k in n for k in ["bed","nest","cushion","lounge"]):
        d.rounded_rectangle((56,143,201,199),22,fill=(104,71,130,255),outline=OUTLINE,width=4)
        d.rounded_rectangle((70,129,135,159),15,fill=(190,165,220,255),outline=OUTLINE,width=3)
    elif any(k in n for k in ["mirror","portrait-frame","window"]):
        d.ellipse((78,52,178,190),fill=(80,92,130,210),outline=GOLD,width=8)
        d.ellipse((91,67,165,176),fill=(155,190,220,150),outline=(220,230,255,160),width=3)
        d.line((128,190,128,215),fill=GOLD,width=7); d.line((105,217,151,217),fill=GOLD,width=6)
    elif any(k in n for k in ["orb","toy-ball","crystal-ball"]):
        glow(img,(128,119),58,c1,100)
        d.ellipse((76,66,180,170),fill=c2+(180,),outline=GOLD,width=5)
        d.polygon([(100,171),(156,171),(171,211),(85,211)],fill=(85,60,115,255),outline=OUTLINE)
    elif any(k in n for k in ["crystal","pillar","obelisk","waystone","tablet"]):
        d.polygon([(128,45),(180,130),(150,205),(105,205),(76,130)],fill=c1+(255,),outline=OUTLINE)
        d.line((128,56,128,194),fill=(240,240,255,160),width=3)
    elif any(k in n for k in ["chest","case","jar","basket"]):
        d.rounded_rectangle((65,120,193,205),12,fill=(105,68,47,255),outline=OUTLINE,width=4)
        d.arc((65,83,193,156),180,360,fill=GOLD,width=6)
        d.rectangle((119,148,140,179),fill=GOLD,outline=OUTLINE,width=3)
    elif any(k in n for k in ["fountain","basin","bowl"]):
        d.ellipse((58,145,198,197),fill=(80,110,150,255),outline=OUTLINE,width=4)
        d.ellipse((79,134,177,173),fill=(120,190,230,190),outline=GOLD,width=3)
        if "fountain" in n:
            d.line((128,80,128,145),fill=(150,210,245,220),width=10)
            d.arc((96,58,160,122),15,165,fill=(200,235,255,220),width=6)
    elif any(k in n for k in ["arch","gateway","door","gate","portal"]):
        d.arc((54,42,202,228),180,360,fill=GOLD,width=14)
        d.line((55,136,55,224),fill=GOLD,width=14); d.line((201,136,201,224),fill=GOLD,width=14)
        glow(img,(128,148),65,c1,90)
        d.rectangle((78,94,178,224),fill=c1+(80,),outline=(220,220,255,120),width=3)
    elif any(k in n for k in ["lantern","candle","flame","chandelier","lamp"]):
        glow(img,(128,132),58,(255,180,90),90)
        if "chandelier" in n:
            d.line((128,30,128,90),fill=GOLD,width=6); d.arc((72,70,184,152),0,180,fill=GOLD,width=8)
            for x in [86,128,170]:
                d.line((x,111,x,151),fill=GOLD,width=5); d.ellipse((x-9,142,x+9,169),fill=(255,190,80,230))
        else:
            rect((92,112,164,190),(74,58,96,255),12)
            d.ellipse((106,85,150,133),fill=(255,190,85,230),outline=GOLD,width=3)
    elif any(k in n for k in ["cauldron","apothecary","potion"]):
        d.ellipse((68,115,188,199),fill=(60,58,75,255),outline=OUTLINE,width=5)
        d.rectangle((80,105,176,132),fill=(75,68,90,255),outline=OUTLINE,width=4)
        for x in [98,128,158]:
            d.rounded_rectangle((x-10,72,x+10,111),6,fill=c1+(220,),outline=GOLD,width=2)
    elif any(k in n for k in ["rug","circle","chart","wheel","compass"]):
        d.ellipse((48,90,208,220),fill=c1+(110,),outline=GOLD,width=6)
        d.ellipse((74,111,182,205),outline=(235,230,255,180),width=3)
        for a in range(0,360,45):
            r=42; x=128+math.cos(math.radians(a))*r; y=158+math.sin(math.radians(a))*r*.7
            d.ellipse((x-4,y-4,x+4,y+4),fill=(245,235,170,255))
    elif any(k in n for k in ["stair","steps","bridge"]):
        if "bridge" in n:
            for i in range(6):
                x=55+i*25
                d.polygon([(x,150),(x+23,145),(x+23,175),(x,180)],fill=(110,75,48,255),outline=OUTLINE)
        else:
            for i in range(5): rect((65+i*14,175-i*18,190-i*4,198-i*18),(95,92,110,255),2)
    elif any(k in n for k in ["potted","fern","flower","vine"]):
        rect((98,168,158,219),(96,64,44,255),8)
        for dx,dy in [(-20,-55),(0,-80),(20,-52),(-5,-45),(12,-65)]:
            d.ellipse((114+dx,146+dy,142+dx,190+dy),fill=(80,150,110,230),outline=OUTLINE,width=2)
    elif any(k in n for k in ["toy","brush","feather"]):
        if "ball" in n:
            d.ellipse((86,105,170,189),fill=c1+(255,),outline=GOLD,width=5)
        elif "feather" in n:
            d.line((108,198,150,76),fill=GOLD,width=5)
            d.polygon([(150,76),(182,101),(153,146),(140,116)],fill=c1+(230,),outline=OUTLINE)
        else:
            d.line((85,180,169,102),fill=GOLD,width=12)
            d.rounded_rectangle((150,80,189,112),10,fill=c1+(255,),outline=OUTLINE,width=3)
    elif "hourglass" in n:
        d.polygon([(90,67),(166,67),(147,127),(166,190),(90,190),(109,127)],fill=(120,170,190,100),outline=GOLD)
        d.polygon([(108,86),(148,86),(128,121)],fill=(235,205,130,220))
        d.polygon([(128,132),(150,176),(106,176)],fill=(235,205,130,220))
    elif "bell" in n:
        d.pieslice((78,70,178,180),180,360,fill=c1+(255,),outline=OUTLINE,width=4)
        d.rectangle((86,124,170,172),fill=c1+(255,),outline=OUTLINE,width=4)
        d.ellipse((118,170,138,191),fill=GOLD,outline=OUTLINE,width=3)
    elif "gauntlet" in n:
        d.polygon([(91,175),(108,87),(145,74),(170,105),(158,190)],fill=(115,88,130,255),outline=OUTLINE)
        for y in [105,128,151]: d.line((111,y,159,y-7),fill=GOLD,width=5)
    else:
        d.polygon([(128,55),(180,120),(165,205),(91,205),(76,120)],fill=(95,72,120,255),outline=OUTLINE)
        d.ellipse((108,100,148,140),fill=c2+(220,),outline=GOLD,width=4)

    for x,y in [(54,76),(201,91),(184,54)]:
        d.line((x-5,y,x+5,y),fill=(245,235,180,210),width=2)
        d.line((x,y-5,x,y+5),fill=(245,235,180,210),width=2)

    img.save(dest,"WEBP",quality=78,method=6)

created=0
eligible=0
for obj in manifest["objects"]:
    if not obj.get("enabled", True): continue
    if not generate_all and not obj.get("preload", False) and not obj.get("placement"):
        continue
    eligible += 1
    dest=root / obj["filename"]
    if dest.exists() and dest.stat().st_size > 100:
        continue
    draw_asset(obj["filename"], dest)
    created += 1

mode = "full-library" if generate_all else "startup-only"
print(f"Majick object library ready: {len(manifest['objects'])} registered, {eligible} eligible for {mode}, {created} starter WebP files generated.")
