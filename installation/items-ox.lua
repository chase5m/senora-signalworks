return {
    ['ssw_vehicle_receiver'] = {
        label = 'Dash Receiver', weight = 900, stack = false, close = true, consume = 0,
        description = 'An in-dash Senora Signalworks receiver for your own vehicle.',
        client = { export = 'chase_bootleg.ChaseUseVehicleReceiver', image = 'ssw_vehicle_receiver.png' }
    },
    ['ssw_portable_radio'] = {
        label = 'Field Radio', weight = 1500, stack = false, close = true, consume = 0,
        description = 'Carry a live station by hand or over your shoulder.',
        client = { export = 'chase_bootleg.ChaseUsePortableRadio', image = 'ssw_portable_radio.png' }
    },
    ['ssw_signalbuds'] = {
        label = 'Signalbuds', weight = 40, stack = false, close = true, consume = 0,
        description = 'Private Signalworks listening, controlled from your phone.',
        client = { export = 'chase_bootleg.ChaseUseSignalbuds', image = 'ssw_signalbuds.png' }
    }
}
