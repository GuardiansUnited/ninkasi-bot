
// Determine our place in the world
const ROOT = '../..';

// Load our classes
const Alliance         = require(`${ROOT}/modules/data/Alliance`);
const ChannelGroup = require(`${ROOT}/modules/data/ChannelGroup`);

// Load singletons
const client = require(`${ROOT}/modules/Client`); // eslint-disable-line no-unused-vars

const conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['del'],
    permLevel: 'admin'
};
exports.conf = conf;

const help = {
    command: 'sync-channel-group',
    name: 'delete',
    category: 'Message Synchronization',
    description: 'Channel synchronization group administration command',
    usage: 'sync-channel-group delete <name>',
    minArgs: 1,
    maxArgs: null
};
exports.help = help;

const run = async (message, commandName, actionName, args) => { // eslint-disable-line no-unused-vars
    if (!client.argCountIsValid(help, args, message, commandName, actionName)) return;
    
    // Get the alliance for this guild
    const alliance = await Alliance.get({guildId: message.guild.id, unique: true});
    if (alliance == null) {
        message.channel.send(`Discord clan must be in an alliance to create a channel synchronization group`);
        return;
    }
    
    // Grab the name
    const name = args.join(' ').replace(/^'(.+)'$/g, '$1').replace(/^'(.+)'$/g, '$1');
    const channelGroup = await ChannelGroup.get({name: name, allianceId: alliance.id, unique: true});
    
    if (channelGroup == null) {
        message.channel.send(`Could not find a channel synchronization group named '${name}'`);
        return;
    }
    
    try {
        await channelGroup.delete();
        message.channel.send(`Channel synchronization group deleted`);
    } catch (error) {
        client.replyWithErrorAndDM(`Deletion of channel synchronization group failed: ${name}`, message, error);
    }
};
exports.run = run;
