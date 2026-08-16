-- gwwg-tablet | client

local tabletOpen = false

-- ============================================================
-- Open / close
-- ============================================================

local function openTablet()
    if tabletOpen then return end
    tabletOpen = true
    TriggerServerEvent('gwwg-tablet:server:requestData')
    SetNuiFocus(true, true)
    SendNUIMessage({ action = 'open' })
end

local function closeTablet()
    if not tabletOpen then return end
    tabletOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

RegisterCommand(Config.Command, openTablet, false)
RegisterKeyMapping(Config.Command, 'Open the job tablet', 'keyboard', Config.OpenKey)

-- ============================================================
-- Server -> NUI
-- ============================================================

RegisterNetEvent('gwwg-tablet:client:receiveData', function(data)
    SendNUIMessage({ action = 'setData', data = data })
end)

RegisterNetEvent('gwwg-tablet:client:notify', function(message)
    SendNUIMessage({ action = 'notify', message = message })
    if not tabletOpen then
        -- fall back to a chat/feed message when the tablet is closed
        BeginTextCommandThefeedPost('STRING')
        AddTextComponentSubstringPlayerName(message)
        EndTextCommandThefeedPostTicker(false, true)
    end
end)

-- ============================================================
-- NUI callbacks
-- ============================================================

RegisterNUICallback('close', function(_, cb)
    closeTablet()
    cb({ ok = true })
end)

RegisterNUICallback('refresh', function(_, cb)
    TriggerServerEvent('gwwg-tablet:server:requestData')
    cb({ ok = true })
end)

RegisterNUICallback('claimQuest', function(data, cb)
    TriggerServerEvent('gwwg-tablet:server:claimQuest', data.kind, data.id)
    cb({ ok = true })
end)

RegisterNUICallback('createMine', function(_, cb)
    TriggerServerEvent('gwwg-tablet:server:createMine')
    cb({ ok = true })
end)

RegisterNUICallback('renameMine', function(data, cb)
    TriggerServerEvent('gwwg-tablet:server:renameMine', data.name)
    cb({ ok = true })
end)

RegisterNUICallback('inviteCrew', function(data, cb)
    TriggerServerEvent('gwwg-tablet:server:inviteCrew', data.targetId)
    cb({ ok = true })
end)

RegisterNUICallback('removeCrew', function(data, cb)
    TriggerServerEvent('gwwg-tablet:server:removeCrew', data.license)
    cb({ ok = true })
end)

-- Escape closes the tablet while focus is captured
CreateThread(function()
    while true do
        if tabletOpen then
            DisableControlAction(0, 200, true) -- ESC (pause menu)
            if IsDisabledControlJustReleased(0, 200) then
                closeTablet()
            end
            Wait(0)
        else
            Wait(250)
        end
    end
end)
