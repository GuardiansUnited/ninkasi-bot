
// Determine our place in the world
const ROOT = '../..';

// Load our classes
const Activity       = require(`${ROOT}/modules/event/Activity`);
const ActivityAlias  = require(`${ROOT}/modules/event/ActivityAlias`);
const DuplicateError = require(`${ROOT}/modules/error/DuplicateError`);

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
    command: 'activity',
    name: 'create-alias',
    category: 'Activity Administration',
    description: 'Create an alias for an activity',
    usage: 'activity create-alias <name|existing-alias> <new-alias>'
};
exports.help = help;

const run = async (message, args, level) => { // eslint-disable-line no-unused-vars
    if (args.length < 2) {
        message.reply(`Usage: ${client.config.prefix}${help.usage}`);
        return;
    }
    
    const alias = args.pop();
    const activitySearchString = args.join(' ').replace(/^"(.+)"$/g, "$1").replace(/^'(.+)'$/g, "$1");
    
    // Find the given activity
    let activities = await Activity.getByNameOrAlias({
        activity_name: activitySearchString,
        alias: activitySearchString
    });
    
    if (activities.length == 0) {
        message.channel.send(`Could not find activity: '${activitySearchString}'`);
        return;
    }
    const activity = activities[0];
    
    // Check if this alias already exists
    const activityAliases = await ActivityAlias.get({alias: alias});
    
    if (activityAliases > 0) {
        message.channel.send(`There is already an activity with that alias`);
        return;
    }
    
    // Build the alias data element
    const data = {
        alias: alias,
        activity_id: activity.activity_id,
        creator_id: message.author.id
    };

    // Attempt to create the alias
    try {
        const activityAlias = await ActivityAlias.create(data);
        message.channel.send(`Activity alias category created`);
        
        client.logger.debug('Activity Alias:');
        client.logger.dump(activityAlias);
    
    } catch (error) {
        if (error instanceof DuplicateError) {
            client.replyWithError(error.message, message);
        } else {
            const label = `${data.category_name} [${data.symbol}]`;
            client.replyWithErrorAndDM(`Creation of activity alias failed: ${label}`, message, error);
        }
    }
};
exports.run = run;