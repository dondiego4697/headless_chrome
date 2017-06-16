/**
 * Created by denstep on 16.06.2017.
 */
class Router{
    constructor(app){
        this.app = app;
        this.init();
    }

    init(){
        this.app.get('/', (req, res)=>{
            res.send('hi');
        });
    }

    start(port){
        return new Promise((resolve)=>{
            this.app.listen(port, ()=>{
                resolve();
                console.log(`LISTEN PORT=${port}`);
            });
        });
    }
}
module.exports = Router;
