-- Created by Chase
-- Senora Signalworks receiver presentation. Keep the supplied models or replace them with meshes using matching pivots.
ChaseBootlegConfig.ReceiverVisuals = {
    enabled = true,
    streamDistance = 65.0,
    pollMilliseconds = 750,
    models = {
        vehicle = 'chase_bootleg_vehicle_receiver',
        portable = 'chase_bootleg_portable_radio',
        leftBud = 'chase_bootleg_signalbud_l',
        rightBud = 'chase_bootleg_signalbud_r'
    },
    -- Vehicle-specific transforms are relative to the vehicle root. Add calibrated mounts for custom interiors.
    mounts = {
        speedo = { x = 0.0, y = 1.30, z = 0.600311, rx = -3.274547, ry = 0.0, rz = 0.0 },
        sultan = { x = 0.15, y = 0.58, z = 0.494821, rx = -6.411878, ry = 0.0, rz = 0.0 }
    },
    -- A generic dashboard bone is only a fallback. Set false to require an explicit model-specific mount.
    fallback = { bone = 'seat_dside_f', x = 0.34, y = 0.56, z = 0.34, rx = 0.0, ry = 0.0, rz = 0.0 },
    -- The DUI replaces each leased radio's actual screen material, so it moves
    -- with the shell. Unique slot textures prevent nearby radios mirroring.
    display = { width = 640, height = 228, distance = 7.0, maximum = 2,
        centre = { x = -0.027, y = -0.0465, z = 0.077 }, size = { width = 0.132, height = 0.047 },
        slots = {
            { model = 'chase_bootleg_vehicle_receiver_1', dictionary = 'chase_bootleg_textures', texture = 'chase_bootleg_dash_display_1' },
            { model = 'chase_bootleg_vehicle_receiver_2', dictionary = 'chase_bootleg_textures', texture = 'chase_bootleg_dash_display_2' }
        } },
    -- Hand carry keys the right shoulder, arm and fingers together. The shoulder must not inherit
    -- the walking arm swing while its child arm is held still. The torso, free arm and legs remain unkeyed.
    -- No movement-style override, speed-based clip switch or extra sway. Floor transitions still bend the hips/torso.
    -- The radio origin is at its handle; its bottom is 0.2825m below it. floorOffset aligns the pickup approach.
    -- The existing shoulder clip is retained separately; this update focuses on hand carry.
    -- Keep dictionary, animation and transform together when replacing a pose. Custom ped skeletons or bulky clothing may need adjustment.
    -- Calibrate in game with Debug = true: /senoraprop <hand|shoulder|leftBud|rightBud|vehicle>, then numpad 4/6, 8/2 and 7/9 move x, y, z
    -- by 5 mm, the same keys with LEFT SHIFT held rotate rx, ry, rz by 2.5 degrees, numpad 5 prints a paste-ready line, numpad 0 stops.
    carry = {
        -- Native order 2 composes Rz * Rx * Ry; Blender's identically named
        -- Euler order composes the reverse. These angles preserve the fitted grip.
        hand = { bone = 57005, x = 0.1223792, y = 0.000, z = -0.024044, rx = -90.0, ry = 0.0, rz = 90.0,
            dictionary = 'chase_bootleg_handcarry', animation = 'chase_hand_idle', walkAnimation = false,
            lowerAnimation = 'chase_hand_lower', raiseAnimation = 'chase_hand_raise', transitionMilliseconds = 1400,
            reachAnimation = 'chase_hand_reach', recoverAnimation = 'chase_hand_recover',
            floorOffset = { x = 0.38, y = 0.42, z = -0.7175 }, floorHeading = 90.0 },
        shoulder = { bone = 57005, x = 0.105, y = 0.000, z = -0.022, rx = 0.0, ry = 0.0, rz = -90.0,
            dictionary = 'chase_bootleg_carry', animation = 'chase_carry_shoulder' }
    },
    -- Freemode SKEL_Head axes: X is up, Y is forward, Z is left. Nozzle pivots sit in the concha; custom heads/head blends may need adjustment.
    buds = {
        left = { bone = 31086, x = 0.035, y = 0.010, z = 0.075, rx = 0.0, ry = 90.0, rz = 0.0 },
        right = { bone = 31086, x = 0.035, y = 0.010, z = -0.075, rx = 0.0, ry = 90.0, rz = 0.0 }
    }
}

-- A carried Field Radio can be set down on the ground. Anyone nearby can tune it, call the host from it or pick it up; picking it up
-- returns the item to that player. Radios older than expireMinutes are deleted together with their item. Distances are metres from the
-- radio, checked server-side in the same routing bucket. maximumPerPlayer limits how many radios one character may leave out at once.
ChaseBootlegConfig.PlacedRadio = { enabled = true, maximumPerPlayer = 1, interactDistance = 2.5, expireMinutes = 90 }

-- Profiles affect live microphone sound and cartridge playback. Frequencies are Hz; distortion adds a restrained vintage speaker character.
ChaseBootlegConfig.ReceiverAudio = {
    portable = { low = 420.0, high = 3300.0, distortion = 0.12 },
    vehicle = { low = 90.0, high = 9000.0, distortion = 0.02 },
    buds = { low = 40.0, high = 16000.0, distortion = 0.0 }
}
