
const conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['sc'],
    permLevel: 'User'
};
exports.conf = conf;

const help = {
    name: 'sync-channel',
    category: 'Message Syncronization',
    description: 'Sync Channel administration command',
    usage: 'sync-command <add-stuff-here>'
};
exports.help = help;

const run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const actionName = args.shift().toLowerCase();
    client.runCommandAction(message, this, actionName, args, level);
};
exports.run = run;
