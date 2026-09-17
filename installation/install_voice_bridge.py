import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
from datetime import datetime, timezone


def ChaseReadSource(path):
    data = path.read_bytes()
    if data.startswith(b'FXAP'):
        raise RuntimeError(f'{path.name} is protected. An editable supported pma-voice installation is required.')
    return data.decode('utf-8-sig')


def ChasePlanInstallation(voice, source):
    manifest = voice / 'fxmanifest.lua'
    main = voice / 'client/init/main.lua'
    phone = voice / 'client/module/phone.lua'
    if not phone.exists():
        phone = voice / 'client/module/call.lua'
    files = {manifest: ChaseReadSource(manifest), main: ChaseReadSource(main), phone: ChaseReadSource(phone)}
    for marker in ('function addVoiceTargets(', 'function toggleVoice(', 'MumbleClearVoiceTargetPlayers'):
        if marker not in '\n'.join(ChaseReadSource(path) for path in (main, phone)):
            raise RuntimeError(f'Unsupported pma-voice layout: {marker} was not found. No files changed.')
    if 'function setCallChannel(channel)' not in files[phone]:
        raise RuntimeError('Unsupported call-channel setter. No files changed.')
    addon = voice / 'chase_bootleg_bridge'
    manifestText = files[manifest]
    if 'chase_bootleg_bridge/client.lua' not in manifestText:
        manifestText = manifestText.rstrip() + "\n\nclient_script 'chase_bootleg_bridge/client.lua'\n"
    if 'chase_bootleg_bridge/server.lua' not in manifestText:
        manifestText = manifestText.rstrip() + "\nserver_script 'chase_bootleg_bridge/server.lua'\n"
    phoneText = files[phone]
    if 'ChaseBootlegBeforeCall(channel)' not in phoneText:
        phoneText = phoneText.replace('function setCallChannel(channel)',
            'function setCallChannel(channel)\n\tif ChaseBootlegBeforeCall then ChaseBootlegBeforeCall(channel) end', 1)
    return {
        manifest: manifestText.encode('utf-8'),
        phone: phoneText.encode('utf-8'),
        addon / 'client.lua': (source / 'client.lua').read_bytes(),
        addon / 'server.lua': (source / 'server.lua').read_bytes(),
    }


def ChaseInstall():
    parser = argparse.ArgumentParser(description='Created by Chase. Inspect or install the editable pma-voice bridge.')
    parser.add_argument('voice_directory', type=Path)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--bridge-source', type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    candidates = (root / 'resource/chase_bootleg/integrations/pma', root / 'integrations/pma', root / 'chase_bootleg/integrations/pma')
    source = args.bridge_source or next((candidate for candidate in candidates if candidate.is_dir()), candidates[0])
    voice = args.voice_directory.resolve(strict=True)
    plan = ChasePlanInstallation(voice, source)
    changes = {path: data for path, data in plan.items() if not path.exists() or path.read_bytes() != data}
    report = {'author': 'Chase', 'mode': 'apply' if args.apply else 'inspection', 'directory': str(voice),
              'changes': [str(path.relative_to(voice)) for path in changes], 'alreadyInstalled': not changes}
    if args.apply and changes:
        backup = voice / 'chase_bootleg_backups' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
        for path in changes:
            if path.exists():
                destination = backup / path.relative_to(voice)
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(path, destination)
        for path, data in changes.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        report['backup'] = str(backup)
    report['sha256'] = {str(path.relative_to(voice)): hashlib.sha256(data).hexdigest() for path, data in plan.items()}
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    ChaseInstall()
