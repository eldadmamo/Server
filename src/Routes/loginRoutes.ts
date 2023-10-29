import express, {Router, Request, Response, NextFunction} from 'express';
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
interface RequestWithBody extends Request {
    body: {[key: string]: string | undefined}
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if(req.session && req.session.loggedIn) {
        next();
        return;
    }

    res.status(403);
    res.send('Not permitted');
}
const router = Router();

router.get('/login', (req: Request, res: Response) => {
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

    `)
})

router.post('/login', (req: RequestWithBody, res: Response) => {
    const {password, email} = req.body;

    if (email && password && email === 'el@gmail.com' && password === 'pass') {
req.session = {loggedIn: true};
res.redirect('/');
    } else {
        res.send('Invalid email and Password')
    }
});

router.get('/', (req: Request, res: Response) => {
   if(req.session && req.session.loggedIn) {
     res.send(`
     <div>
     <div>You are Logged in</div>
     <a href="/logout">Logout</a>
     </div>
     `)
   } else {
       res.send(`
     <div>
     <div>You are not Logged in</div>
     <a href="/logout">Logout</a>
     </div>
     `)
   }
})

router.get('/logout', (req: Request, res: Response) => {
    req.session = undefined;
    res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
    res.send('Welcome to protected Route, logged in user');
})

export {router};

class Server {
    app: express.Express = express();

    constructor() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cookieSession({keys: ['abcde']}));
        this.app.use(router);
    }

    start() : void {
        this.app.listen(3000, () => {
            console.log('Listening on port 3000')
        })
    }
}

new Server().start();