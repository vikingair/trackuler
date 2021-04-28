import fs from 'fs';
import path from 'path';
import express from 'express';
import { backendRoot } from "./paths.js";

const _withLeadingZero = (num) => ('0' + num).slice(-2);
const toApiString = (date) =>
    `${date.getFullYear()}-${_withLeadingZero(date.getMonth() + 1)}-${_withLeadingZero(date.getDate())}`;

const getPathForToday = (date) => path.join(backendRoot, 'database', toApiString(date) + '.json');
const getCurrentContent = (date) => {
    const pathToday = getPathForToday(date);
    if (fs.existsSync(pathToday)) {
        return { tracks: JSON.parse(fs.readFileSync(pathToday, 'utf8')), pathToday };
    }
    return { tracks: [], pathToday };
};

const init = (app) => {
    app.use(express.json())

    app.get('/api/tracks', (req, res) => {
        res.send(getCurrentContent(new Date()).tracks);
    });

    app.get('/api/tracks/latest', (req, res) => {
        res.status(404).send("not yet implemented");
    });

    app.post('/api/track', (req, res) => {
        const { ID, description, time } = req.body;
        const track = { ID, description, time};
        const { tracks, pathToday } = getCurrentContent(new Date(time));
        let isCreate = true;
        const nextTracks = tracks.map((t) => {
            if (t.ID !== track.ID) return t;
            isCreate = false;
            return track;
        });
        isCreate && nextTracks.push(track);
        fs.writeFileSync(pathToday, JSON.stringify(nextTracks));
        res.send({ time });
    });

    app.delete('/api/track', (req, res) => {
        const { ID } = req.body;
        const { tracks, pathToday } = getCurrentContent(new Date());
        fs.writeFileSync(pathToday, JSON.stringify(tracks.filter((track) => track.ID !== ID)));
        res.status(204).send();
    });

    app.get('/api/*', (req, res) => {
        res.status(404).send('Endpoint not specified');
    });
};

export const API = { init };
