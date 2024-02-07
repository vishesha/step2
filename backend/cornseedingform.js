// backend/routes/seeding_rate_form.js
const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Define a route for handling form submissions
router.post("/seedingratesubmit", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body and session
        const { seedingRate, notes, teamName } = req.body;
        // Assuming teamName is stored in the session

        // Check if a row with the same teamName already exists in the database
        const checkQuery = "SELECT * FROM seeding_rate_form WHERE teamName = ?";
        db.query(checkQuery, [teamName], (checkError, checkResult) => {
          if (checkError) {
            console.error("Error checking for existing row:", checkError);
            res.status(500).json({ message: "Form submission failed" });
            return;
          }

          if (checkResult.length === 0) {
            // No existing row found, insert a new row
            const insertQuery =
              "INSERT INTO seeding_rate_form (teamName, seedingRate, notes) VALUES (?, ?, ?)";
            db.query(
              insertQuery,
              [teamName, seedingRate, notes],
              (insertError, insertResult) => {
                if (insertError) {
                  console.error(
                    "Error inserting form data into the database:",
                    insertError
                  );
                  res.status(500).json({ message: "Form submission failed" });
                } else {
                  res.status(200).json({
                    message: "Form submitted successfully",
                  });
                }
              }
            );
          } else {
            // Existing row found, update the row with new details
            const updateQuery =
              "UPDATE seeding_rate_form SET seedingRate = ?, notes = ? WHERE teamName = ?";
            db.query(
              updateQuery,
              [seedingRate, notes, teamName],
              (updateError, updateResult) => {
                if (updateError) {
                  console.error(
                    "Error updating form data in the database:",
                    updateError
                  );
                  res.status(500).json({ message: "Form submission failed" });
                } else {
                  res.status(200).json({
                    message: "Form submitted successfully",
                  });
                }
              }
            );
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling form submission:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.post("/getCornseedingForms", (req, res) => {
  setupDatabase()
    .then((db) => {
      // Extract the username from the request body
      const { username } = req.body;

      // Define the SQL query to fetch submitted forms data for the specified user
      const fetchQuery = "SELECT * FROM seeding_rate_form WHERE teamName = ?";

      // Execute the query to fetch data
      db.query(fetchQuery, [username], (error, result) => {
        if (error) {
          console.error("Error fetching submitted forms data:", error);
          res.status(500).json({ message: "Failed to fetch data" });
        } else {
          // Send the fetched data as a JSON response
          res.status(200).json(result);
        }
      });
      db.release();
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.get("/getAllCornseedingForms", (req, res) => {
  setupDatabase()
    .then((db) => {
      // Extract the username from the request body

      // Define the SQL query to fetch submitted forms data for the specified user
      const fetchQuery = "SELECT * FROM seeding_rate_form";

      // Execute the query to fetch data
      db.query(fetchQuery, (error, result) => {
        if (error) {
          console.error("Error fetching submitted forms data:", error);
          res.status(500).json({ message: "Failed to fetch data" });
        } else {
          // Send the fetched data as a JSON response
          res.status(200).json(result);
        }
      });
      db.release();
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

module.exports = router;
