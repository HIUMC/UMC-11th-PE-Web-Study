#!/usr/bin/env bash
set -euo pipefail
movie_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$movie_dir/../../mission1/umcine"
printf '기존 UMCine: http://localhost:5173 (이미 실행 중이면 이 명령을 중복 실행하지 마세요.)\n'
exec pnpm dev --port 5173 --strictPort
