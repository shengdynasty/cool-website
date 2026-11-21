#!/bin/bash
# Encodes the graded frames: H.264 MP4 and VP9 WebM, both BT.709 (tagged, so browsers decode the green right), muted,
# one keyframe per loop. usage: scripts/modula-cover/encode.sh <graded dir> <out basename>  (writes .mp4 and .webm)
set -euo pipefail
src=$1
out=$2
tags=(-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv)
vf="scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p"
ffmpeg -v error -y -framerate 30 -i "$src/f%05d.png" -vf "$vf" -c:v libx264 -preset veryslow -crf 26 \
  -x264-params keyint=360:min-keyint=360 "${tags[@]}" -movflags +faststart -an "$out.mp4"
log=$(mktemp -t vp9pass)
ffmpeg -v error -y -framerate 30 -i "$src/f%05d.png" -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf 48 -row-mt 1 -deadline good \
  -cpu-used 1 -g 360 -auto-alt-ref 1 -lag-in-frames 25 "${tags[@]}" -pass 1 -passlogfile "$log" -an -f null /dev/null
ffmpeg -v error -y -framerate 30 -i "$src/f%05d.png" -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf 48 -row-mt 1 -deadline good \
  -cpu-used 1 -g 360 -auto-alt-ref 1 -lag-in-frames 25 "${tags[@]}" -pass 2 -passlogfile "$log" -an "$out.webm"
rm -f "$log"*
ls -l "$out.mp4" "$out.webm"
