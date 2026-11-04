#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export DB_USERNAME="${DB_USERNAME:-root}"
export DB_NAME="${DB_NAME:-umc_movie_week5}"
if [[ -z "${DB_PASSWORD+x}" ]]; then
  read -r -s -p "MySQL ${DB_USERNAME} 비밀번호 (화면에 표시되지 않음): " DB_PASSWORD
  printf '\n'
  export DB_PASSWORD
fi
printf 'DB: %s / 계정: %s\n' "$DB_NAME" "$DB_USERNAME"
./gradlew bootRun --console=plain
