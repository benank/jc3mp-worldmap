// add network events, add extraction stuff, etc etc also add removal of players on destroy

jcmp.events.AddRemoteCallable('worldmap/map_ready', (player) => 
{
    SyncPlayers(player);

    player.worldmap_interval = setInterval(() => 
    {
        SyncPlayers(player)
    }, 5000);
})

jcmp.events.AddRemoteCallable('worldmap/teleport', (player, x, z) => 
{
    player.position = new Vector3f(x, 4200, z);
})

function SyncPlayers(player)
{
    if (!player || !player.name)
    {
        if (player.worldmap_interval)
        {
            clearInterval(player.worldmap_interval);
        }

        return;
    }

    const data = jcmp.players.map((p) => 
    ({
        id: p.networkId,
        name: (p.escapedNametagName) ? p.escapedNametagName : p.name,
        color: (p.freeroam) ? p.freeroam.colour : (p.color) ? p.color : '#878787',
        x: p.position.x,
        z: p.position.z
    }))

    jcmp.events.CallRemote('worldmap/sync', player, JSON.stringify(data));
}

jcmp.events.Add('PlayerDestroyed', (player) => 
{
    clearInterval(player.worldmap_interval);
    jcmp.events.CallRemote('worldmap/remove_player', null, player.networkId);
})