# Verification scope

The 0.3.11 release is a source/packaging cleanup of 0.3.10. It was prepared separately from the running server; no deployment, restart or database migration was performed during packaging.

## Release checks

| Check | Result |
| --- | --- |
| Gameplay Lua preservation | Staged client/server/shared/integration files equal the authoritative baseline after comment removal |
| Loaded configuration comparison | Exactly three differences: framework `auto`, keys `auto`, debug `false` |
| Lua syntax | All 39 Lua files parse unmodified under Lua 5.4; no native-hash substitution was needed |
| Streamed asset integrity | All 21 streamed binaries byte-identical to 0.3.10 |
| UI source provenance | All 41 recorded input hashes match the source used for the installed UI |
| Baseline UI rebuild | All 24 rebuilt active UI files match the installed baseline byte-for-byte |
| Cleaned UI equivalence | 22 source checks: emitted TypeScript/JSX JavaScript syntax trees and normalized compiled CSS match the original inputs |
| UI build | Locked dependency install, TypeScript checking and production build pass |
| Existing Lua regression suites | 355 mocked assertions pass across 16 suites |
| Current browser suites | Dashboard DUI, dashboard editor, Field Radio hint, audio acoustics and speech suites pass |

Lua suites cover backend actions/money/access, crew/calls, receivers, dashboard lifecycle/math/server validation, acoustics/audio routing, shop permissions, speech state, key contracts and vehicle adapters. They run the staged handlers with controlled native/framework/database mocks. Legacy config filenames in those harnesses map to the equivalent staged configuration; loaded-config equivalence is checked separately against the release's actual manifest order.

Two historical broad browser suites have **seven failed expectations on both the original 0.3.10 build and this release**. They include obsolete install-button/passive-DUI expectations, a dialog-focus expectation and audio gain/timing expectations. They remain recorded as inherited/unresolved test failures, not silently marked as passes or treated as proof of new regressions. The newer dashboard-specific tests cover the current interactive amber display.

Closing the listener request dialog discards its unsent draft; reopening starts with an empty message. This existing behavior accounts for the dialog expectation. Other inherited failures target the replaced install button, the older passive display, or audio sampled before its volume fade settles. The current authority checks and acoustic fade tests pass.

Source formatting and configuration organization are therefore checked independently of broad historical UI expectations. These results do not certify FXServer execution, MariaDB transport, live voice mixing or remote-client behavior.

## Native evidence from the underlying runtime

On 17 September 2026, one local Qbox player session observed successful van/key collection, deploy-distance refusal, nearby deployment, 98.7 FM broadcast start/stop, Field Radio equip/tuning, floor placement/pickup, put-away, rig packing and van storage. A bundled ident was captured through the station's private cue output; waveform comparison confirmed the local sound. That was not a second client's reception.

The user previously accepted the 0.3.10 Field Radio hand grip and ordinary walking. Flags 33, the accepted attachment and animation assets are preserved. That acceptance does not cover every ped, shoulder pose, floor transition or multiplayer condition. UI/F8 obscured placement/pickup and packing animations during the later session, so their animation quality was not newly accepted.

## Still required before a server-wide rollout

- Independent broadcaster/listener clients: actual speech, music/cues, volume, distance and routing-bucket isolation.
- Remote carried/placed prop replication and signalbud privacy.
- Dashboard placement, physical display and persistence on the server's actual registered vehicles.
- Shoulder carry, other peds/walk styles and unobscured floor transitions.
- Calls/co-hosts, permissions, concurrent actions, battery depletion/recharge and failure/interruption recovery.
- Planned reconnect/restart testing and integration checks for customized frameworks, inventories and voice resources.

This repository includes the runtime and UI source/build files. Private development harnesses, player evidence, extracted geometry and local audit directories are not part of the public package. A compact release check record is provided in [verification.json](verification.json).
