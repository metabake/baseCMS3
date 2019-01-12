import { EditorRoutes } from './lib/editor';
const express = require('express');
const appE = express();
const yaml = require('js-yaml');
const fs = require('fs');
let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));
console.info(config);
const editorsPort = config.editorAPIport;

//express app for editors
const editorRoutes = new EditorRoutes();
appE.use('/editors', editorRoutes.routes(config));

const wwwPort = config.editorsWwwPort;
const wwwApp = express();

wwwApp.use(express.static('www'));

wwwApp.listen(wwwPort, () => {
   console.info(`wwwApp listening on port ${wwwPort}!`);
});

appE.listen(editorsPort, () => {
   console.info(`appE listening on port ${editorsPort}!`);
});