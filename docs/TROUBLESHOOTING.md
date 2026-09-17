# Troubleshooting

| Symptom | Check |
| --- | --- |
| UI/items cannot call the resource | Folder name must be `chase_bootleg`; verify dependency start order and the actual error text. |
| Database missing table/column | Import all four SQL files in order into the oxmysql database, including music and receiver mounts. |
| Studio access refused | Check `signalworks` job, grade/duty settings, station membership and current character. |
| Deploy/start refused | Park, exit and stand beside the correct van; check ready stage, battery and routing bucket. |
| Van keys delayed | Allow streaming/key replication, then open the studio beside the van to retry existing key recovery. Check the selected key adapter. |
| Receiver item missing/unusable | Merge the matching item definitions and three images; verify inventory selection and `chase_bootleg` export names. |
| Dashboard installation refused | Use a registered parked vehicle, sit in the driver seat, carry the installation item and check actual refusal text. Ambient cars have no saved vehicle record. |
| G/X appears unresponsive | Close inventory/NUI/phone, check the contextual radio state, and inspect saved FiveM bindings. An automation key-injection failure alone is not a script bug. |
| Microphone unavailable | Verify both protocol-3 bridge files and dependency order; check death, active PMA call/radio and station authorization. |
| Music provider does not play | Check the provider setting, valid public URL, provider restrictions and client connectivity. Provider availability is external to this resource. |
| Phone app absent | Enable the LB Phone adapter and start the configured resource before Signalworks. Commands remain available without the phone. |
| UI preview shows sample stations | `?preview=1` is development mock mode; do not treat it as a live server test. |

Report the resource version, framework, inventory/voice versions, reproduction steps and relevant console error in [Discord](https://discord.gg/n8W5JRJ96s). Redact credentials, private player data and unrelated server configuration.
