import e, {Express} from 'express';
import route from './router';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const whitelist = [
    "http://localhost:3000",
    "https://www.luckylevel.io",
    "https://luckylevel.io"
]
class App {
    public app: Express;

    constructor(){
        this.app = e();
        this.app.use(cors({origin: whitelist}))

        this.middlewares();
        this.router();
    }

    private middlewares():void{
        this.app.use(e.json());
    }

    private router():void{
        this.app.use(route);
    }
}

export default  new App().app;