const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Define a route for handling insurance selection form submissions
router.post("/cottoninsurancesubmit", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body
        const { teamName, coverage, level } = req.body;

        // Check if a row with the same teamName already exists
        const checkQuery =
          "SELECT * FROM cotton_insurance_selection_form WHERE teamName = ?";
        db.query(checkQuery, [teamName], (checkError, checkResult) => {
          if (checkError) {
            console.error("Error checking for existing row:", checkError);
            res.status(500).json({ message: "Form submission failed" });
            return;
          }

          if (checkResult.length > 0) {
            // If a row with the same teamName exists, update it
            const updateQuery = `
              UPDATE cotton_insurance_selection_form
              SET coverage = ?, level = ?
              WHERE teamName = ?
            `;
            db.query(
              updateQuery,
              [coverage, level, teamName],
              (updateError, updateResult) => {
                if (updateError) {
                  console.error("Error updating existing row:", updateError);
                  res.status(500).json({ message: "Form submission failed" });
                } else {
                  res
                    .status(200)
                    .json({ message: "Form updated successfully" });
                }
              }
            );
          } else {
            // If no row with the same teamName exists, insert a new row
            const insertQuery = `
              INSERT INTO cotton_insurance_selection_form (teamName, coverage, level)
              VALUES (?, ?, ?)
            `;
            db.query(
              insertQuery,
              [teamName, coverage, level],
              (insertError, insertResult) => {
                if (insertError) {
                  console.error("Error inserting new row:", insertError);
                  res.status(500).json({ message: "Form submission failed" });
                } else {
                  res
                    .status(200)
                    .json({ message: "Form submitted successfully" });
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

// Export the router for use in your main Express app
// Define a route for fetching insurance selection data for a specific user
router.post("/cottongetInsuranceSelectionForms", (req, res) => {
  setupDatabase()
    .then((db) => {
      // Extract the username from the request body
      const { username } = req.body;

      // Define the SQL query to fetch insurance selection data for the specified user
      const fetchQuery =
        "SELECT * FROM cotton_insurance_selection_form WHERE teamName = ?";

      // Execute the query to fetch data
      db.query(fetchQuery, [username], (error, result) => {
        if (error) {
          console.error("Error fetching insurance selection data:", error);
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

router.post("/cottongetAllInsuranceSelectionForms", (req, res) => {
  setupDatabase()
    .then((db) => {
      // Extract the username from the request body

      // Define the SQL query to fetch insurance selection data for the specified user
      const fetchQuery = "SELECT * FROM cotton_insurance_selection_form";

      // Execute the query to fetch data
      db.query(fetchQuery, (error, result) => {
        if (error) {
          console.error("Error fetching insurance selection data:", error);
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

// Export the router for use in your main Express app
module.exports = router;
