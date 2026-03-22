import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

let totalRequests = 0;
let successRequests = 0;
let failedRequests = 0;
let activeRequests = 0;
let totalResponseTime = 0;

function fakeDB() {
    const baseTime = 100;
    const degraded = baseTime + activeRequests * 50;
    return new Promise((resolve) => setTimeout(resolve, degraded));
}

function timeout(ms) {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), ms)
    );
}

app.get("/", async (req, res) => {
    totalRequests++;
    activeRequests++;
    const start = Date.now();

    try {
        await Promise.race([
            fakeDB(),
            timeout(10000) 
        ]);

        const responseTime = Date.now() - start;
        totalResponseTime += responseTime;
        successRequests++;
        activeRequests--;
        res.json({ responseTime });

    } catch (e) {
        failedRequests++;
        activeRequests--;
        res.status(503).json({ error: "Timed out" });
    }
});

setInterval(() => {
    const avg = successRequests === 0 ? 0 : Math.floor(totalResponseTime / successRequests);
    console.clear();
    console.log(`  Active          : ${activeRequests}`);
    console.log(`  Total Requests  : ${totalRequests}`);
    console.log(`  Avg Resp Time   : ${avg}ms`);
    console.log(`  Failed          : ${failedRequests}`);
}, 1000);

app.listen(3000, () => console.log("Server running on port 3000"));