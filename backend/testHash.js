const bcrypt = require("bcryptjs");

const hashes = [
    "$2a$10$znrRMuWFXeXzNWsNR0q/3e4GbAb8l6/l3ePd4rdfUEcSoCGaLQOtO",
    "$2b$10$8rWMQL4OAaHyyiwKENqonuTx4wHLifHIDwkHo0LtNRxNYsV4.PeQa"
];

const candidates = [
    "admin",
    "admin123",
    "admin1234",
    "admin@123",
    "admin@nec.com",
    "password",
    "123456",
    "12345678",
    "nssadmin",
    "necadmin",
    "nssportal",
    "necnss",
    "adminnss"
];

const run = async () => {
    for (const hash of hashes) {
        console.log(`Checking hash: ${hash}`);
        for (const cand of candidates) {
            try {
                // bcryptjs handles both $2a$ and $2b$ hashes
                const match = await bcrypt.compare(cand, hash);
                if (match) {
                    console.log(`  MATCH FOUND: "${cand}"`);
                }
            } catch (err) {
                // Ignore parsing errors
            }
        }
    }
};

run();
