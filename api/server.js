// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require("@babel/register")({
    presets: ["@babel/preset-env"],
    plugins: [
        ["@babel/plugin-transform-runtime",
            {
                "regenerator": true
            }
        ]
    ],
});

import { getImg } from './getImg';
import  { siteCheck } from './create';

const express = require('express');
const app = express();
const port = 8080;

app.get('/check-1/:site', getImg);
app.get('/:site/:device/:size/:layout/:dev?', siteCheck);
app.listen(port, () => console.log(`Looki server listening on port ${port}!`));
