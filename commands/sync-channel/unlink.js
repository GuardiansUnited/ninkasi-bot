
// Determine our place in the world
const ROOT = '../..';

// Load our classes
const ChannelGroup = require(`${ROOT}/modules/data/ChannelGroup`);
const Channel      = require(`${ROOT}/modules/data/Channel`);

// Load singletons
const client = require(`${ROOT}/modules/Client`); // eslint-disable-line no-unused-vars

const conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'admin'
};
exports.conf = conf;

const help = {
    command: 'sync-channel',
    name: 'unlink',
    category: 'Message Synchronization',
    description: 'Unlink this channel from a synchronization group',
    usage: 'sync-channel unlink [<channel>]',
    minArgs: null,
    maxArgs: null
};
exports.help = help;

const run = async (message, commandName, actionName, args) => { // eslint-disable-line no-unused-vars
    if (!client.argCountIsValid(help, args, message, commandName, actionName)) return;
    
    //
    // TODO - Enhance this function so that a channel reference can be given
    // instead of always linking to the channel from which the command was called
    //
    
    if (args.length != 0) {
        message.reply(`Usage: ${client.config.prefix}${help.usage}`);
        return;
    }
    
    const channel = await Channel.get({id: message.channel.id, unique: true});
    if (channel == null) {
        message.channel.send(`This channel is not linked to a channel synchronization group`);
        return;
    }
    
    const channelGroup = await ChannelGroup.get({id: channel.channelGroupId, unique: true});

    try {
        await channel.delete();
        message.channel.send(`Channel unlinked from channel synchronization group: ${channelGroup.name}`);
    } catch (error) {
        await client.replyWithErrorAndDM(`Unlinking channel from channel synchronization group failed: ${channelGroup.name}`, message, error);
        client.logger.dump(error);
    }
};
exports.run = run;
