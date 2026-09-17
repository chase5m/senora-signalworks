# Configuration

Start with **`config.lua`**. It contains common settings and loads after the advanced files. All settings still use the existing `ChaseBootlegConfig` table, so integration contracts remain stable.

| File | Settings |
| --- | --- |
| `config.lua` | Framework, keys, inventory, job, prices, depot/vendor, phone/voice, dashboard access and common keys |
| `config/defaults.lua` | Base station, money, range, vehicle, battery, scanner, cartridge, security and runtime defaults |
| `config/devices.lua` | Inventory schemas, item IDs, shop details and receiver distances |
| `config/visuals.lua` | Studio prop transforms, target interaction, phone and key defaults |
| `config/receivers.lua` | Receiver models, dashboard slots, fitted hand/shoulder/bud offsets and floor radio limits |
| `config/controls.lua` | Field Radio key defaults |
| `config/speech.lua` | Speech indicator settings and frequency-directory command |
| `config/music.lua` | Providers, queue limits, DJ/autonomous mode, co-hosts, calls and station PTT |
| `config/acoustics.lua` | Occlusion, cabin and exterior sound settings |
| `config/dashboard.lua` | Placement limits, close-up camera and dashboard commands |

The manifest loads these advanced files in a defined order, then loads top-level `config.lua`. An override there wins. Assign an individual field when possible; replacing a whole table can remove required advanced fields. Avoid editing the same option in two places.

## Public defaults

Only three defaults change from the local 0.3.10 development baseline: `Framework='auto'`, `Keys.provider='auto'`, and `Debug=false`. The advanced baseline tables retain their original values; the common file applies these public overrides. Auto selects Qbox, then QBCore, then ESX based on running resources. Select an explicit provider if your server has multiple compatibility bridges or a customized setup.

The resource uses the station bank account setting for supported station transactions. With ox_inventory, the native receiver shop spends its configured inventory currency (`money`) and is separate from that bank setting. Prices and units are labelled in config comments.

## Locations and vehicles

Relocate both `Depot.position` and `Depot.spawn`; keep the spawn bay clear. Set the depot/vendor routing bucket to match your intended world. The stock `speedo` conversion has calibrated prop transforms; changing its model requires physical fit checks.

Saved dashboard mounts are offsets from the registered vehicle root. Placement limits remain server-enforced. Enabling owner-only dashboard access is optional; persistence still requires a valid framework vehicle record.

## Audio and controls

Power ranges default to 650 / 1,800 / 4,200 metres. Field Radio sound is full within two metres and fades to twelve; dashboard exterior sound fades to eighteen, with cabin/obstruction attenuation. These settings require multi-client listening checks after changes. Provider embeds receive supported gain changes; they do not promise the same filtering as bundled audio or live voice.

Caps Lock is the default station PTT key. Do not share PMA's normal radio/proximity keys. Players' saved FiveM bindings take precedence over server defaults; explain rebinding through Settings → Key Bindings → FiveM after a key change.

Preserve the fitted Field Radio hand dictionary, grip and flags 33 unless deliberately developing and live-testing a replacement. Those values work together; shoulder and floor transitions use separate animation behavior.

## Debugging

Debug is off for public installs. Enable it temporarily when diagnosing an issue, then disable it. The prop calibration command changes local attachment calibration during a session; it is a development tool, not an ordinary player control. Never use a diagnostic setting as a substitute for server-side authorization.
