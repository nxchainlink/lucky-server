import e, {Express} from 'express';
import route from './router';
import cors from 'cors';

class App {
    public app: Express;

    constructor(){
        this.app = e();
        this.app.use(cors({origin: "http://localhost:3000"}))

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