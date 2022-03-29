const express = require("express");
const path = require("path");
const pool = require("./db");
const cors = require("cors");

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../../my-app")));

// Handles any other requests that don't match
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname+"../public/index.html"))
// })

// middleware
// Allows different domains of the app to interact (localhost:5000 from the back with localhost:3000 from the front).
app.use(cors());
// req.body
app.use(express.json());

// Routes

// Create a movement
app.post("/movements", async (req, res) => {
  try {
    const { concept, amount, dateM, typeM } = req.body;
    const newMovement = await pool.query(
      "INSERT INTO movement (concept, amount, dateM, typeM) VALUES ($1, $2, $3, $4) RETURNING *",
      [concept, amount, dateM, typeM]
    );

    res.json(newMovement.rows[0]);
  } catch (e) {
    console.error(e.message);
  }
});

// Get all movements
app.get("/movements", async (req, res) => {
  try {
    const allMovements = await pool.query(
      "SELECT * FROM movement ORDER BY movement_id DESC"
    );
    res.json(allMovements.rows);
  } catch (e) {
    console.error(e.message);
  }
});

// Get only selected type of movements
app.get("/movements/type/:t", async (req, res) => {
  try {
    const { t } = req.params;
    const allSelected = await pool.query(
      "SELECT * FROM movement WHERE typem = $1 ORDER BY movement_id DESC",
      [t]
    );
    res.json(allSelected.rows);
  } catch (e) {
    console.error(e);
  }
});

// Get last 10 (quantity) movements
app.get("/movements/last/:q", async (req, res) => {
  try {
    const { q } = req.params;
    const allMovements = await pool.query(
      "SELECT * FROM movement ORDER BY movement_id DESC LIMIT $1",
      [q]
    );
    res.json(allMovements.rows);
  } catch (e) {
    console.error(e.message);
  }
});

// Get total balance from all movements
app.get("/movements/balance", async (req, res) => {
  try {
    const allIncomes = await pool.query(
      "SELECT SUM(amount) FROM movement WHERE typem='I'"
    );
    const allOutcomes = await pool.query(
      "SELECT SUM(amount) FROM movement WHERE typem='O'"
    );
    const totalBalance = allIncomes.rows[0].sum - allOutcomes.rows[0].sum;
    res.json(totalBalance);
  } catch (e) {
    console.error(e.message);
  }
});

// Get a movement
app.get("/movements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movement = await pool.query(
      "SELECT * FROM movement WHERE movement_id = $1",
      [id]
    );
    res.json(movement.rows[0]);
  } catch (e) {
    console.error(e.message);
  }
});

// Update a movement
app.put("/movements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { concept, amount, dateM, typeM } = req.body;
    const updateMovement = await pool.query(
      "UPDATE movement SET concept = $1, amount = $2, dateM = $3, typeM = $4 WHERE movement_id = $5",
      [concept, amount, dateM, typeM, id]
    );
    res.json("Movement updated!");
  } catch (e) {
    console.error(e.message);
  }
});

// Delete a movement
app.delete("/movements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteMovement = await pool.query(
      "DELETE FROM movement WHERE movement_id = $1",
      [id]
    );
    res.json("Movement deleted");
  } catch (e) {
    console.error(e.message);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
