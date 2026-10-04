"""Lista arquivos versionados de um repositório, sem modificar conteúdo."""
import argparse
import pathlib
import subprocess
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("diretorio")
args = parser.parse_args()
root = pathlib.Path(args.diretorio).resolve()
if not root.is_dir():
    parser.error("Diretório inexistente")
try:
    result = subprocess.run(["git", "-C", str(root), "ls-files", "-z"], capture_output=True, check=True)
except (OSError, subprocess.CalledProcessError) as error:
    print("Não foi possível listar arquivos versionados: " + str(error), file=sys.stderr)
    raise SystemExit(1)
for name in result.stdout.decode("utf-8", errors="replace").split("\0"):
    if name:
        print(name)
