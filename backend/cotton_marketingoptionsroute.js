const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Define a route for inserting marketing options
router.post("/cottoninsertMarketingOption", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body
        const { teamName, date, contractType, quantityBushels, complete } =
          req.body;

        // Insert a new marketing option
        const insertQuery =
          "INSERT INTO cotton_marketing_options (teamName, date, contractType, quantityBushels,complete) VALUES (?, ?, ?, ?,?)";
        db.query(
          insertQuery,
          [teamName, date, contractType, quantityBushels, complete],
          (insertError, insertResult) => {
            if (insertError) {
              console.error(
                "Error inserting marketing option into the database:",
                insertError
              );
              res.status(500).json({ message: "Option insertion failed" });
            } else {
              res.status(200).json({
                message: "Option inserted successfully",
              });
            }
          }
        );
        db.release();
      } catch (error) {
        console.error("Error handling marketing option insertion:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// Define a route for fetching marketing options
router.get("/cottonfetchMarketingOptions", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the teamName from the query parameters
        const { teamName } = req.query;

        // Query the database to fetch all marketing options for the specified teamName
        const query =
          "SELECT * FROM cotton_marketing_options WHERE teamName = ?";
        db.query(query, [teamName], (error, results) => {
          if (error) {
            console.error("Error fetching marketing options:", error);
            res.status(500).json({ message: "Error fetching options" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling marketing options fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.get("/cottonfetchAllMarketingOptions", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the teamName from the query parameters
        // Query the database to fetch all marketing options for the specified teamName
        const query = "SELECT * FROM cotton_marketing_options";
        db.query(query, (error, results) => {
          if (error) {
            console.error("Error fetching marketing options:", error);
            res.status(500).json({ message: "Error fetching options" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling marketing options fetch:", error);
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
