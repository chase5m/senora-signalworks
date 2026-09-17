# Commands and controls

Commands below use the defaults. In chat, include `/`; in the FiveM F8 console, omit `/`. Players' saved key mappings may differ.

| Command / key | Purpose |
| --- | --- |
| `/senora`, `/bootleg`, F5 | Open the receiver interface |
| `/senorastudio`, `/bootlegstudio` | Open the authorized station studio |
| `/senorafrequencies` | Browse active listed frequencies |
| `/senorashop` | Receiver shop while beside the configured vendor |
| `/senoradash` | Interact with an installed physical dashboard receiver |
| `/senoramount` | Install/reposition a receiver as the parked driver of a registered vehicle |
| `/senorascan`, `/bootlegscan` | Police scanner, subject to job/duty permissions |
| Caps Lock | Station push-to-talk while an authorized station microphone/call is active |
| Y / `/senoracallaccept` | Accept a ringing listener call |
| U / `/senoracalldecline` | Decline a ringing listener call |
| G | Place the held Field Radio or pick up a nearby placed radio |
| X | Put away the held Field Radio or cancel its action |

Use the receiver item through inventory to equip it. In the receiver UI, select the Field device and Hand or Shoulder mode. There is no separate supported hand/shoulder console equip command. Placement/pickup requires the appropriate nearby state; close other menus before using contextual keys.

The registered console aliases `+chase_bootleg:fieldPlace` and `+chase_bootleg:fieldCancel` invoke the existing Field Radio actions. Their corresponding `-` commands release the key binding. These are useful when diagnosing input bindings; they do not bypass server validation.

`/senoraprop` is a debug-only attachment calibration tool. Leave `Debug=false` for normal operation and do not use calibration as a player control.

Console/station access still depends on job, station membership, distance, vehicle state, routing bucket and supported voice readiness. A command's presence does not grant access.
