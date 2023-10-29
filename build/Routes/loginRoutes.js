"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
function requireAuth(req, res, next) {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }
    res.status(403);
    res.send('Not permitted');
}
const router = (0, express_1.Router)();
exports.router = router;
router.get('/login', (req, res) => {
    res.send(`
<form method ="POST">
    <div>
    <label>Email</label>
    <input name="email" type="email" />
    </div>
    <div>
    <label>Password</label>
    <input type="password" name="password"/>
    </div>
    <button>Submit</button>
</form>

    `);
});
router.post('/login', (req, res) => {
    const { password, email } = req.body;
    if (email && password && email === 'el@gmail.com' && password === 'pass') {
        req.session = { loggedIn: true };
        res.redirect('/');
    }
    else {
        res.send('Invalid email and Password');
    }
});
router.get('/', (req, res) => {
    if (req.session && req.session.loggedIn) {
        res.send(`
     <div>
     <div>You are Logged in</div>
     <a href="/logout">Logout</a>
     </div>
     `);
    }
    else {
        res.send(`
     <div>
     <div>You are not Logged in</div>
     <a href="/logout">Logout</a>
     </div>
     `);
    }
});
router.get('/logout', (req, res) => {
    req.session = undefined;
    res.redirect('/');
});
router.get('/protected', requireAuth, (req, res) => {
    res.send('Welcome to protected Route, logged in user');
});
