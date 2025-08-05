// Import express
const express = require("express");
const app = express();

// Port number
const PORT = 3000;

// Route: GET /home
app.get("/home", (req, res) => {
  res.status(200).send("<h1>Welcome to Home Page</h1>");
});

// Route: GET /aboutus
app.get("/aboutus", (req, res) => {
  res.status(200).json({ message: "Welcome to About Us" });
});

// Route: GET /contactus
app.get("/contactus", (req, res) => {
  res.status(200).json({
    email: "contact@example.com",
    phone: "+91-9999999999",
    address: "123 Express Lane, Node City, JS"
  });
});

// Handle undefined routes - 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
