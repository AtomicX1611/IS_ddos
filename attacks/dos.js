import axios from "axios";

async function attack() {

    while (true) {
        const start = Date.now();
        try {
            await axios.get("http://localhost:3000");
            const end = Date.now();
            const responseTime = end - start;
            console.log(`Attacker response time: ${responseTime} ms`);
        } catch (e) {
            const end = Date.now();
            const responseTime = end - start;
            console.log(`Request failed after ${responseTime} ms`, e);
        }
    }   
}

for(let i = 0;i<10;i++){
    attack();
}