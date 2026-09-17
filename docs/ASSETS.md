# Included assets

The `stream/` directory contains the original Signalworks equipment drawables, texture dictionary, archetype definitions and carry animation dictionaries used by the 0.3.10 runtime. Their binary bytes are preserved in this release. No third-party replacement van is bundled; the station uses GTA V's stock Speedo.

The assets include studio roof components, mast, console, lamp/lever, receiver equipment, two physical dashboard material slots, the Field Radio and separate left/right Signalbuds. Required inventory art is in `installation/inventory-images/`; the three receiver images are also used by the UI. Original ident/intermission WAV files are under `web/audio/` and `ui/public/audio/`.

The accepted hand grip uses `chase_bootleg_handcarry` with the fitted hand attachment and flags 33. The separate shoulder dictionary remains unchanged. Geometry, animation, attachment coordinates and playback flags form one contract; do not recenter an object or substitute a pose without native fit/movement checks.

Compiled game assets are supplied ready for use. Private extracted reference geometry, ped previews, developer caches and historical asset-generation archives are not distributed. Source availability in this release describes the Lua, UI and adapters; it does not promise a complete Blender authoring project.

Original assets follow [LICENSE.md](../LICENSE.md). Fonts and other third-party components retain their own terms in [THIRD_PARTY_NOTICES.txt](../THIRD_PARTY_NOTICES.txt).
