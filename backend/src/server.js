const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/fileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});