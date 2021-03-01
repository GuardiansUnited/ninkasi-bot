
// Determine our place in the world
const ROOT = '../..';

// Load our classes
const SyncChannelGroup = require(`${ROOT}/modules/sync/SyncChannelGroup`);
const SyncChannel      = require(`${ROOT}/modules/sync/SyncChannel`);

// Load singletons
const client = require(`${ROOT}/modules/Client`); // eslint-disable-line no-unused-vars

const conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: null
};
exports.conf = conf;

const help = {
    command: 'sync-channel-group',
    name: 'info',
    category: 'Message Synchronization',
    description: 'Show the details about a channel synchronization group',
    usage: 'sync-channel-group info <group-name>'
};
exports.help = help;

const run = async (message, args, level) => { // eslint-disable-line no-unused-vars
    if (args.length != 1) {
        message.reply(`Usage: ${client.config.prefix}${help.usage}`);
        return;
    }
    
    const name = args[0];
    const syncChannelGroups = await SyncChannelGroup.get({name: name});
    
    if (syncChannelGroups.length == 0) {
        message.channel.send(`Could not find channel synchronization group: ${name}`);
        return;
    }
    
    const syncChannelGroup = syncChannelGroups[0];
    const syncChannels = await SyncChannel.get({'channelGroupId': syncChannelGroup.id});
    let responseContent = `Channel synchronization group '${syncChannelGroup.name}' found with ${syncChannels.length} channel`;
    
    if (syncChannels.length != 1) {
        responseContent += 's';
    }

    if (syncChannels.length > 0) {
        responseContent += '\n';
    }
    
    for (let x = 0; x < syncChannels.length; x++) {
        const syncChannel = syncChannels[x];
        const channel = await syncChannel.getDiscordChannel();
        responseContent += `\n    <#${channel.id}> (${channel.guild.name})`;
    }
    message.channel.send(responseContent);
};
exports.run = run;