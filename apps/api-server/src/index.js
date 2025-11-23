const express = require("express");
const { add } = require("utils"); // import here
const app = express();
const PORT = 2000;

app.get("/add", (req, res) => {
  const { a, b } = req.query;
  console.log(`api hit with ${a} and ${b}`);
  res.json({ result: add(Number(a), Number(b)) });
});

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("heyo your end point is up");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
