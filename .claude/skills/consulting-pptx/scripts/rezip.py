#!/usr/bin/env python3
"""Recompress a .pptx so it isn't bloated.

pptxgenjs writes an uncompressed ZIP (with empty directory stubs). This repacks
every member with DEFLATE and drops directory entries, shrinking the file a lot
without changing its contents.

Usage: python3 rezip.py path/to/file.pptx
"""
import sys
import zipfile
import shutil
import os


def rezip(path: str) -> None:
    tmp = path + ".tmp"
    with zipfile.ZipFile(path, "r") as zin:
        infos = [i for i in zin.infolist() if not i.filename.endswith("/")]
        with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zout:
            # [Content_Types].xml must be first for maximum compatibility
            infos.sort(key=lambda i: (i.filename != "[Content_Types].xml", i.filename))
            for info in infos:
                data = zin.read(info.filename)
                zout.writestr(info.filename, data)
    shutil.move(tmp, path)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 rezip.py <file.pptx>", file=sys.stderr)
        sys.exit(1)
    target = sys.argv[1]
    if not os.path.isfile(target):
        print(f"Not found: {target}", file=sys.stderr)
        sys.exit(1)
    before = os.path.getsize(target)
    rezip(target)
    after = os.path.getsize(target)
    print(f"rezipped {target}: {before:,} -> {after:,} bytes")
