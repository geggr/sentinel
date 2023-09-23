import sys
import subprocess

CURRENT_FOLDER = "./"

def build(entrypoint: str):
    return subprocess.run([
        "npm",
        "--prefix",
        f"{CURRENT_FOLDER}{entrypoint}",
        "run",
        "build"
    ])

def init_pm2():
    return subprocess.run([
        "npm",
        "start"
    ])

DEFAULT_ARGS = ["", "--no-build"]

envies = [
    "client",
    "server",
    "dashboard"
]

_, mode = sys.argv if len(sys.argv) > 1 else DEFAULT_ARGS

if mode == '--build':
    for envie in envies:
        build(envie)

init_pm2()



