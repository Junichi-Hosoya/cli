const minimist = require('minimist');
const tools = require('./tools');
const alias = require('./alias');
const doctor = require('./modules/doctor');
const version = require('./modules/version');
const help = require('./modules/help');
const generate = require('./modules/generate');
const build = require('./modules/build');
const flag = require('./modules/flag');
const navigate = require('./modules/nav');
const run = require('./modules/run');

const argv = minimist(process.argv.slice(2));
const modules = {
	doctor, version, help, generate, build, flag, navigate, run,
};

// Alias first and second params of argv._
if (argv._[0] && alias.first[argv._[0]]) argv._[0] = alias.first[argv._[0]];
if (argv._[1] && alias.second[argv._[1]]) argv._[1] = alias.second[argv._[1]];

module.exports = async () => {
	if (typeof modules[argv._[0]] === 'function') {
		await modules[argv._[0]](argv, tools);
	} else {
		modules.help(argv, tools);
	}
};
