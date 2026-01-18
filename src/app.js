import express from 'express';
import authRoutes from "./routes/auth.routes.js"
import bookingRoutes from "./routes/bookings.routes.js"
const app = express();

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/bookings", bookingRoutes)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
