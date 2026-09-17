#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
SRC_ASSET="$ROOT_DIR/src/core/templates/principal-cv/style.css"
DEST_DIR="$ROOT_DIR/dist/src/core/templates/principal-cv"

mkdir -p "$DEST_DIR"
cp "$SRC_ASSET" "$DEST_DIR/style.css"
