import compression from 'compression';
import express from 'express';
import path from 'path';
import { API } from "./api.js";
import { backendRoot } from "./paths.js";

const PORT = 7777;

// starting the server
const app = express();

API.init(app);

// configure gzip compression
app.use(compression());

// try to deliver static assets in first place
const pathToFrontendBuild = path.join(backendRoot, '..', 'frontend', 'build');
app.use(express.static(pathToFrontendBuild));

// fallback to index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(pathToFrontendBuild, 'index.html'));
});

// listen on the correct port
console.log('Serving on :' + PORT);
app.listen(PORT);
