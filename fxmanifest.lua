fx_version 'cerulean'
game 'gta5'

author 'Chase'
description 'Senora Signalworks | Mobile broadcasting studios by Chase'
version '0.3.11'

ui_page 'web/index.html'

shared_scripts {
    '@ox_lib/init.lua',
    'config/defaults.lua',
    'config/devices.lua',
    'config/visuals.lua',
    'config/receivers.lua',
    'config/controls.lua',
    'config/speech.lua',
    'config/music.lua',
    'config/acoustics.lua',
    'config/dashboard.lua',
    'config.lua',
    'shared/domain.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/framework.lua',
    'server/database.lua',
    'server/money.lua',
    'server/voice.lua',
    'server/runtime.lua',
    'integrations/keys_server.lua',
    'integrations/devices_server.lua',
    'server/receivers.lua',
    'server/shop.lua',
    'server/actions.lua',
    'server/main.lua'
}

client_scripts {
    'client/acoustics.lua',
    'client/voice.lua',
    'client/main.lua',
    'client/world.lua',
    'client/receivers.lua',
    'client/dashboard_math.lua',
    'client/dashboard.lua',
    'client/shop.lua',
    'integrations/keys.lua',
    'integrations/phone.lua'
}

files {
    'web/index.html',
    'web/**/*',
    'stream/chase_bootleg_props.ytyp'
}

data_file 'DLC_ITYP_REQUEST' 'stream/chase_bootleg_props.ytyp'

dependencies {
    '/onesync',
    'ox_lib',
    'oxmysql'
}
