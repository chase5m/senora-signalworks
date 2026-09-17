# Senora Signalworks

<p align="center">
  <img src="https://docs.chasedev.dev/assets/signalworks-cover.png" alt="Senora Signalworks" width="960">
</p>

**Mobile radio stations for FiveM. Created by Chase.**

[Documentation](https://docs.chasedev.dev) · [Download](https://github.com/chase5m/senora-signalworks/releases/latest) · [Discord support](https://discord.gg/n8W5JRJ96s)

## Features

- Studio vans with deployable equipment and live broadcasts.
- Music queues, microphones, co-hosts, listener calls, requests and tips.
- Portable Field Radios, dashboard receivers and private Signalbuds.
- Qbox, QBCore and ESX adapters, with optional LB Phone integration.

## Installation

1. Download the latest release and place `chase_bootleg` in your server's resources folder.
2. Follow the [installation guide](https://docs.chasedev.dev/signalworks/installation) for dependencies, SQL, items and the voice bridge.
3. Set up `config.lua`. Advanced settings are in `config/`.

The built UI is included. Keep the resource folder named `chase_bootleg`.

## UI development

After editing `ui/src/`, rebuild the UI:

```sh
cd ui
npm ci
npm run build
```

## License

Free to use and modify. **No resale or rebranding.** See [LICENSE.md](LICENSE.md) for the terms and [NOTICE.md](NOTICE.md) for third-party credits.
