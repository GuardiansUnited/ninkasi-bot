
// Determine our place in the world
const ROOT = '../..';

// Load our classes
const Alliance  = require(`${ROOT}/modules/data/Alliance`);
const Guild     = require(`${ROOT}/modules/data/Guild`);

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
    command: 'alliance',
    name: 'clans',
    category: 'Alliance Administration',
    description: 'List all clans in this alliance',
    usage: 'alliance clans',
    minArgs: null,
    maxArgs: 0
};
exports.help = help;

const run = async (message, commandName, actionName, args) => { // eslint-disable-line no-unused-vars
    if (!client.argCountIsValid(help, args, message, commandName, actionName)) return;
    
    const alliances = await Alliance.get({guildId: message.guild.id});
    
    if (alliances.length == 0) {
        message.channel.send(`This discord clan is not in an alliance`);
        return;
    }
    
    const alliance = alliances[0];
    const guilds = await Guild.get({allianceId: alliance.id});
    
    let response = `**${alliance.name}** - ${guilds.length} `;
    if (guilds.length == 0 || guilds.length > 1) {
        response += 'clans';
    } else {
        response += 'clan';
    }
    response += ' found';
    
    if (guilds.length > 0) {
        const guildListElements = [];
        for (let x = 0; x < guilds.length; x++) {
            const guild = guilds[x];
            guildListElements.push(await guild.getTitle());
        }
        response += '```' + guildListElements.join('\n') + '```';
    }
    
    message.channel.send(response);
};
exports.run = run;
