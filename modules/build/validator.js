const fs = require('fs');
const singleGenerate = require('./proto/single');

module.exports = async (argv, tools) => {
	if (argv._[2] && !argv._[2].match(tools.regex.name)) {
		throw new Error('Bad proto name');
	}
	const { rootDir } = await tools.getRootMeta();
	if (!fs.existsSync(process.env.GOPATH)) {
		throw new Error('GOPATH does not exist');
	}
	const validatorOutdir = `${process.env.GOPATH}/src`;
	if (!fs.existsSync(validatorOutdir)) {
		fs.mkdirSync(validatorOutdir);
	}

	const validator = true;

	if (argv._[2]) {
		const filename = `proto/${argv._[2]}.proto`;
		const pfile = `${rootDir}/${filename}`;
		if (!fs.existsSync(pfile)) {
			throw new Error('Bad proto name');
		}
		await singleGenerate({
			filename, rootDir, validatorOutdir, validator,
		}, tools);
		return;
	}

	// get all proto file
	const protoDir = `${rootDir}/proto`;
	if (!fs.existsSync(protoDir)) {
		throw new Error('No proto dir');
	}
	const files = fs.readdirSync(protoDir);
	for (let i = 0; i < files.length; i += 1) {
		const filename = `proto/${files[i]}`;
		const pfile = `${rootDir}/${filename}`;
		const lst = fs.lstatSync(pfile);
		if (lst.isFile() && pfile.endsWith('.proto')) {
			await singleGenerate({
				filename, rootDir, validatorOutdir, validator,
			}, tools);
		}
	}
};
