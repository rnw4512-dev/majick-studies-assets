"""Prepare the reviewed uploaded music without changing source approvals.

Usage: python tools/asset-pipeline/prepare_music.py ORIGINAL_DOWNLOAD_FOLDER
Requires ffmpeg. Original filenames and SHA-256 values are checked before use.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

repository = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('originals', type=Path)
parser.add_argument('--output', type=Path, default=repository/'current-site/assets/licensed/music')
args = parser.parse_args()
intake = json.loads((repository/'docs/audits/evidence/completion-2026-11-24/music-intake.json').read_text())
args.output.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as temporary:
    for track in intake['tracks']:
        if track['id'] == 'enchanted-festival':
            archive = args.originals/intake['festivalArchive']['name']
            if hashlib.sha256(archive.read_bytes()).hexdigest() != intake['festivalArchive']['sha256']:
                raise SystemExit('Festival archive differs from the reviewed source')
            source = Path(temporary)/'festival-loop.wav'
            with zipfile.ZipFile(archive) as bundle:
                source.write_bytes(bundle.read(intake['festivalArchive']['selectedMember']))
        else:
            source = args.originals/track['sourceName']
        if hashlib.sha256(source.read_bytes()).hexdigest() != track['sourceSha256']:
            raise SystemExit('Source differs from the reviewed file: '+track['sourceName'])
        subprocess.run([
            'ffmpeg','-v','error','-nostdin','-y','-i',str(source),'-vn',
            '-af','loudnorm=I=-22:TP=-2:LRA=9','-ar','44100','-ac','2',
            '-c:a','libvorbis','-q:a','2',str(args.output/(track['id']+'.ogg'))
        ], check=True)
        print('Prepared',track['title'])
print('Review outputs and explicitly approve their exact digests before publishing.')
