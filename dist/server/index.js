"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const db = new sqlite3_1.default.Database('blogposts.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the blogposts database.');
});
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map