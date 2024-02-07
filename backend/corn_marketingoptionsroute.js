const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Define a route for inserting marketing options
router.post("/insertMarketingOption", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body
        const { teamName, date, contractType, quantityBushels, complete } =
          req.body;
        const submitteddate = new Date().toISOString().slice(0, 10);
        // Insert a new marketing option
        const insertQuery =
          "INSERT INTO marketing_options (teamName, date, contractType, quantityBushels, complete,submitteddate) VALUES (?, ?, ?, ?, ?,?)";
        db.query(
          insertQuery,
          [
            teamName,
            date,
            contractType,
            quantityBushels,
            complete,
            submitteddate,
          ],
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
router.get("/fetchMarketingOptions", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the teamName from the query parameters
        const { teamName } = req.query;

        // Query the database to fetch all marketing options for the specified teamName
        const query = "SELECT * FROM marketing_options WHERE teamName = ?";
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

router.get("/fetchAllMarketingOptions", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the teamName from the query parameters
        // Query the database to fetch all marketing options for the specified teamName
        const query = "SELECT * FROM marketing_options";
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

router.post("/updateCompleted/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Define the new value for the "complete" field
        const newCompleteValue = "yes";

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().slice(0, 10);

        // Perform the database update operation
        const updateQuery =
          "UPDATE marketing_options SET complete = ?, completedon = ? WHERE id = ?";
        db.query(
          updateQuery,
          [newCompleteValue, today, appId],
          (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating the record:", updateError);
              res.status(500).json({ message: "Error updating the record" });
            } else {
              res.status(200).json({ message: "Record updated successfully" });
            }
          }
        );
        db.release();
      } catch (error) {
        console.error("Error handling update of the record:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.delete("/deletemarketingApplication/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Perform the database delete operation
        const deleteQuery = "DELETE FROM marketing_options WHERE id = ?";
        db.query(deleteQuery, [appId], (deleteError, deleteResult) => {
          if (deleteError) {
            console.error("Error deleting the marketing data:", deleteError);
            res
              .status(500)
              .json({ message: "Error deleting the marketing application" });
          } else {
            res
              .status(200)
              .json({ message: "marketing application deleted successfully" });
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling marketing application deletion:", error);
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
