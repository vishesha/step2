const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Create the cotton_growth_regulation table if it doesn't exist
router.get("/createCottonGrowthRegulationTable", (req, res) => {
  setupDatabase()
    .then((db) => {
      db.query(createCottonGrowthRegulationTable, (error) => {
        if (error) {
          console.error("Error creating table:", error);
          res.status(500).json({ message: "Error creating table" });
        } else {
          res.status(200).json({ message: "Table created successfully" });
        }
      });
      db.release();
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// Define a route for inserting growth regulation data
router.post("/cottonInsertGrowthRegulation", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body
        const { teamName, date, regulator, rate } = req.body;

        // Insert a new growth regulation record
        const insertQuery =
          "INSERT INTO cotton_growth_regulation (teamName, date, regulator, rate) VALUES (?, ?, ?, ?)";
        db.query(
          insertQuery,
          [teamName, date, regulator, rate],
          (insertError) => {
            if (insertError) {
              console.error(
                "Error inserting growth regulation data into the database:",
                insertError
              );
              res.status(500).json({ message: "Data insertion failed" });
            } else {
              res.status(200).json({
                message: "Data inserted successfully",
              });
            }
          }
        );
        db.release();
      } catch (error) {
        console.error(
          "Error handling growth regulation data insertion:",
          error
        );
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// Define a route for fetching growth regulation data
router.get("/cottonFetchGrowthRegulation", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the teamName from the query parameters
        const { teamName } = req.query;

        // Query the database to fetch all growth regulation data for the specified teamName
        const query =
          "SELECT * FROM cotton_growth_regulation WHERE teamName = ?";
        db.query(query, [teamName], (error, results) => {
          if (error) {
            console.error("Error fetching growth regulation data:", error);
            res.status(500).json({ message: "Error fetching data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling growth regulation data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.get("/cottonFetchAllGrowthRegulation", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the teamName from the query parameters

        // Query the database to fetch all growth regulation data for the specified teamName
        const query = "SELECT * FROM cotton_growth_regulation";
        db.query(query, (error, results) => {
          if (error) {
            console.error("Error fetching growth regulation data:", error);
            res.status(500).json({ message: "Error fetching data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling growth regulation data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

module.exports = router;
