import express from "express";

const app = express();

let totalRequests = 0;
let activeRequests = 0;
let totalResponseTime = 0;

function fakeDB(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {}  
}

app.get("/", (req, res) => {

    totalRequests++;
    activeRequests++;

    const start = Date.now();
    fakeDB(1000);
    const end = Date.now();

    const responseTime = end - start;
    totalResponseTime += responseTime;
    activeRequests--;
    res.send("Server responded successfully");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

setInterval(() => {
    const avg = totalRequests === 0 ? 0 : Math.floor(totalResponseTime / totalRequests);
    console.clear();
    console.log("===== SERVER METRICS =====");
    console.log("Total Requests:", totalRequests);
    // console.log("Average Response Time:", avg, "ms");
}, 1000);