fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'gwwg-tablet'
author 'gwwg'
description 'Job Center tablet — jobs, daily/weekly quests, persistent mining business'
version '1.0.0'

ui_page 'html/index.html'

shared_scripts {
    'config.lua',
}

client_scripts {
    'client/main.lua',
}

server_scripts {
    'server/main.lua',
}

files {
    'html/index.html',
    'html/style.css',
    'html/app.js',
}
