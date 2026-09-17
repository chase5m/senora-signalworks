# Live voice bridge

The included bridge extends pma-voice's target routing for authorized station speech, co-hosts and calls. Both included bridge files report **protocol version 3**, which the server requires. Protocol-2 files are not compatible with this release.

## Inspect, then install

From this resource directory, run the Python 3 installer with your editable pma-voice directory. Inspection is read-only:

```sh
python installation/install_voice_bridge.py "PATH/TO/pma-voice"
```

Review the reported file list. To apply that plan during your chosen maintenance window:

```sh
python installation/install_voice_bridge.py "PATH/TO/pma-voice" --apply
```

The installer copies `integrations/pma/client.lua` and `server.lua` into `pma-voice/chase_bootleg_bridge/`, appends their manifest declarations, and inserts a call-start hook. It backs up existing changed files under `pma-voice/chase_bootleg_backups/<timestamp>/`. An already matching installation is left unchanged. Protected or unsupported layouts are rejected.

After applying, restart pma-voice and then `chase_bootleg` during planned maintenance. Restarting voice interrupts active players' voice sessions; the release package itself does not perform any server action.

## Manual equivalent

Copy both bridge files and append these to pma-voice's manifest after its existing module declarations:

```lua
client_script 'chase_bootleg_bridge/client.lua'
server_script 'chase_bootleg_bridge/server.lua'
```

At the beginning of the editable `setCallChannel(channel)` function in `client/module/phone.lua` (or its corresponding `call.lua`), add:

```lua
if ChaseBootlegBeforeCall then ChaseBootlegBeforeCall(channel) end
```

The extension expects the supported `addVoiceTargets`, `toggleVoice`, `setCallChannel`, `radioData`, `callData`, `radioPressed` and `voiceTarget` integration points. Preserve pma-voice's own license and source attribution. Heavily modified voice distributions need a reviewed combined integration.

## Acceptance checks

Use independent host and listener clients, then a third client on an unrelated call/radio. Check station speech delivery, release/close, tuning, volume, distance, routing buckets, normal PMA call/radio interruptions, disconnects and cleanup. Microphone state must not silently reopen after normal voice use interrupts it.

Field Radio speakers may be heard nearby by other players; Signalbuds are private. Vehicle receivers can be heard by eligible nearby exterior listeners with cabin/obstruction attenuation, as well as occupants. This differs from historical occupant-only documentation.

The local test session verified a bundled ident through the host's private cue output. It did not certify another player's reception or live microphone delivery. Source checks and mocked voice tests do not substitute for these multi-client checks.

The previously inspected pma-voice installation identified itself as 7.0.1. The installer checks source structure; it does not establish universal version compatibility.
