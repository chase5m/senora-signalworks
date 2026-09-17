# Installation

Created by Chase. These instructions describe the included 0.3.11 files.

## Dependencies

- A GTA V FiveM server with OneSync enabled.
- `ox_lib` and `oxmysql`.
- One running framework: `qbx_core`, `qb-core` or `es_extended`.
- A compatible database. The supplied migrations use MariaDB syntax, including `ADD COLUMN IF NOT EXISTS` in `003_music.sql`; review that syntax before using a different database engine.
- A supported inventory for receiver items: `ox_inventory`, `qb-inventory` or standard ESX inventory.
- On Qbox, `qbx_vehicles` for registered dashboard-vehicle lookup.
- `pma-voice` with the included protocol-3 bridge for live microphones, co-hosts and calls. Other station/UI functions do not certify live voice readiness.

Optional integrations are `ox_target`, LB Phone and the configured key provider. The key adapter recognizes `qbx_vehiclekeys`, `qb-vehiclekeys` and `wasabi_carlock`. Framework and phone dependencies are not bundled.

## Resource and database

1. Place this folder at `resources/[chase]/chase_bootleg`. Do not leave the GitHub ZIP suffix or rename the resource contract.
2. Back up the destination database before installation or upgrade.
3. Import these files **in this order** into the same database configured for oxmysql:

| Order | File | Purpose |
| --- | --- | --- |
| 1 | `sql/install.sql` | Stations, crew, requests and payment records |
| 2 | `sql/002_receivers.sql` | Saved vehicle receivers |
| 3 | `sql/003_music.sql` | Station mode and music queue |
| 4 | `sql/004_receiver_mounts.sql` | Saved receiver position/rotation |

Do not import test data. These files create or add schema; they do not supply a station, give players money, create a player character or replace framework tables. Existing station data should be backed up before migrations even where statements are repeatable.

## Job and items

Use the definitions matching the running framework and inventory. Merge their entries into your existing tables; do not replace an entire framework/inventory file with the supplied `return` table.

| Setup | Job definition | Item definition |
| --- | --- | --- |
| Qbox + ox_inventory | `installation/job-qbox.lua` | `installation/items-ox.lua` |
| QBCore + qb-inventory | `installation/job-qb.lua` | `installation/items-qb.lua` |
| ESX standard inventory | `installation/job-esx.sql` | `installation/items-esx.sql` |
| ESX with ox_inventory | `installation/job-esx.sql` | `installation/items-ox.lua` |

The three required receiver items are `ssw_portable_radio`, `ssw_vehicle_receiver` and `ssw_signalbuds`. Copy the three matching PNGs from `installation/inventory-images/` into your inventory image directory. ox_inventory item exports already point to `chase_bootleg`; QB/ESX usable item handlers are registered by the included server adapter.

The default broadcaster job is `signalworks`, grade 0 or higher, with duty not required. Assign the job using your framework's normal administrative tools. Players without that job may buy receivers and listen. A new station costs 45,000 bank by default; it is not automatically granted by installing the resource.

## Configure and start

Edit `config.lua`, especially the depot interaction point and spawn bay, receiver vendor location, job, prices, selected inventory, optional phone and voice settings. Automatic framework/key detection is the public default. See [configuration](CONFIGURATION.md).

Install the [voice bridge](VOICE.md) before testing live microphones. Start your chosen framework, inventory, key and phone dependencies first. A Qbox example is:

```cfg
ensure ox_lib
ensure oxmysql
ensure qbx_core
ensure qbx_vehicles
ensure ox_inventory
ensure qbx_vehiclekeys
ensure pma-voice
ensure lb-phone
ensure chase_bootleg
```

This is an ordering example, not a replacement `server.cfg`; retain your framework's required dependencies and database setup. Omit optional resources you do not use. Fresh job/item definitions may require a planned framework/inventory or server restart. Do not hot-restart production dependencies with active users without arranging that maintenance yourself.

## First session

Open `/senorastudio` as a broadcaster, create or reuse a station, collect the van and confirm keys. Park, exit, stand near the van, deploy and wait for readiness. Start transmission, then equip a receiver through your inventory and tune to the same frequency. Use a second independent client to verify actual broadcast voice and remote radio visibility.

The studio van uses the stock `speedo` and is managed by this resource. It is not registered as a dealership/garage-owned vehicle. Dashboard installation is a separate feature: use a **registered vehicle**, occupy the driver seat and remain parked. With `Dashboard.requireOwner=false`, that parked driver may install/reposition without owning the vehicle record; ambient unregistered cars still fail validation.

## Upgrade from 0.3.10

Keep a backup of the existing resource and database. Merge customized settings into the new top-level `config.lua` or the relevant `config/` file; the former root `config.*.lua` paths have moved. Replace the resource as a complete folder so old configuration/build files are not mixed with new ones. Retain the resource name and SQL data. Protocol-3 voice bridge files are unchanged except comment cleanup; older protocol-2 bridges must be upgraded.

0.3.11 preserves the accepted hand grip, asset binaries and hand animation flags 33. It does not add a gameplay feature or claim new native acceptance. Review [TESTING.md](TESTING.md) before release on a populated server.
