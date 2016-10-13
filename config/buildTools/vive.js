const builder = require(`builder`);
const path = require('path');
const request = require('request');
const child_process = require('child_process');
const iconProcess = require('./iconProcess');

const init = project => cb => {
    if (project.canceled)
        return cb('cancelled');

    const tempProjectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, configs.builder.tempProjectName);
    const projectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, project.userId, project.appId);

    project.tempProjectPath = tempProjectPath;
    project.projectPath = projectPath;

    fs.stat(projectPath, (err, status) => {
        if (status) {
            console.log(`folder exists: ${projectPath}`);
            return cb();
        }

        fs.mkdirp(projectPath, err => {
            console.log(`folder created: ${projectPath}`);
            if (err) {
                return cb(err);
            }

            return cb();
        });
    });
};

const copyTemplate = project => cb => {
    if (project.canceled)
        return cb('cancelled');

    fs.copy(project.tempProjectPath, project.projectPath, (err) => {
        console.log(`copy to folder: ${project.projectPath}`);
        return cb(err);
    });
};

const clean = project => cb => {
    return cb();
};

const setupBuild = project => cb => {
    return cb();
};

const setupProject = project => cb => {
    if (project.canceled)
        return cb('cancelled');

    const jsonFilePath = path.join(project.projectPath, "RodinData", "config.json");
    project.jsonFilePath = "RodinData/config.json";
    const content = JSON.stringify({
        "appName": project.appName,
        "appUrl": project.url
    });

    fs.writeFile(jsonFilePath, content, 'utf-8', (err) => {
        if (err) {
            return cb(err);
        }

        console.log('Json change success');
        return cb();
    });
};

const build = project => cb => {
    if (project.canceled)
        return cb('cancelled');

    child_process.exec(`zip -r Rodin.zip ${project.jsonFilePath}`, {cwd: project.projectPath}, (err, stdout, stderr) => {
        console.log('stdout: ' + stdout);
        console.log('err: ' + err);
        console.log('stderr: ' + stderr);

        if (err || stdout.match(new RegExp('error'))) {
            project.built = 'failed';
        } else {
            project.built = 'success';
        }

        console.log(`build status: ${project.built}`);
        project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'Rodin.zip');
        return cb();
    });
};

const rename = project => cb => {
    return cb();
};

module.exports.init = init;
module.exports.copyTemplate = copyTemplate;
module.exports.clean = clean;
module.exports.setupBuild = setupBuild;
module.exports.setupProject = setupProject;
module.exports.build = build;
module.exports.rename = rename;
