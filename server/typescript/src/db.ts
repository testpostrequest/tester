import { Pool } from "pg";

const pool = new Pool({
    "user": "test",
    "host": "localhost",
    "database": "stride",
    "password": "1234",
    "port": 5432,
});

export default pool;
