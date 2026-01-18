import "dotenv/config";
import app from "./app.js";
import pool  from "./config/db.js";
const PORT =3000;

async function startServer() {
  try{
    const client=await pool.connect()
    await client.query("SELECT 1")
    client.release()
    console.log("PostgreSQL connected")
    app.listen(PORT,()=>{
      console.log(`Server running on ${PORT}`)
    })
  }catch (err) {
    console.error(`Failed to connect to PostgreSQL`)
    console.error(err.message)
    process.exit(1)
  }
}

startServer()
