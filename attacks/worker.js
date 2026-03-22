import axios from "axios";

function randomIP() {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(".");
}

export default async function attack(botId, concurrency) {
    const fakeIP = randomIP();
    console.log(`[Bot-${botId} | PID:${process.pid} | ${fakeIP}] started`);

    const loops = Array.from({ length: concurrency }, (_, loopId) =>
        runLoop(botId, loopId, fakeIP)
    );

    await Promise.all(loops);
}

async function runLoop(botId, loopId, fakeIP) {
    while (true) {
        const start = Date.now();
        try {
            await axios.get("http://localhost:3000", {
                headers: {
                    "X-Forwarded-For": fakeIP,
                    "User-Agent": `Bot-${botId}/Loop-${loopId}`,
                },
                timeout: 5000,
            });
            console.log(`[Bot-${botId}:${loopId}] OK — ${Date.now() - start}ms`);
        } catch (e) {
            console.log(`[Bot-${botId}:${loopId}] FAIL — ${e.code} (${Date.now() - start}ms)`);
        }
    }
}