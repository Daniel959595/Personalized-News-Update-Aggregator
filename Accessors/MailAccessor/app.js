const express = require("express");

const emailRoutes = require("./routes/emailRoutes");

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

// route for email updates
app.use("/email", emailRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
