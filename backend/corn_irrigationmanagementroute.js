const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Define a route for handling soil moisture sensor submissions
router.post("/soilmoisturesensorsubmit", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body
        const {
          teamName,
          sensorType,
          date,
          reading,
          options,
          applied,
          dateToday,
        } = req.body;

        // Insert a new row without checking for duplicates
        const insertQuery =
          "INSERT INTO soil_moisture_sensor_data (teamName, sensorType, date, reading,options,applied,dateToday) VALUES (?, ?, ?, ?,?,?,?)";
        db.query(
          insertQuery,
          [teamName, sensorType, date, reading, options, applied, dateToday],
          (insertError, insertResult) => {
            if (insertError) {
              console.error(
                "Error inserting sensor data into the database:",
                insertError
              );
              res
                .status(500)
                .json({ message: "Sensor data submission failed" });
            } else {
              res.status(200).json({
                message: "Sensor data submitted successfully",
              });
            }
          }
        );
        db.release();
      } catch (error) {
        console.error("Error handling sensor data submission:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// Define a route for fetching soil moisture sensor data
router.get("/fetchSoilMoistureSensorData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        const { teamName } = req.query;
        // Query the database to fetch all soil moisture sensor data
        const query =
          "SELECT * FROM soil_moisture_sensor_data WHERE teamName = ?";
        db.query(query, [teamName], (error, results) => {
          if (error) {
            console.error(
              "Error fetching sensor data from the database:",
              error
            );
            res.status(500).json({ message: "Error fetching sensor data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling sensor data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.get("/fetchAllSoilMoistureSensorData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Query the database to fetch all soil moisture sensor data
        const query = "SELECT * FROM soil_moisture_sensor_data";
        db.query(query, (error, results) => {
          if (error) {
            console.error(
              "Error fetching sensor data from the database:",
              error
            );
            res.status(500).json({ message: "Error fetching sensor data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling sensor data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// Add a new route for deleting an irrigation application by appId
router.delete("/deleteirrigationApplication/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Perform the database delete operation
        const deleteQuery =
          "DELETE FROM soil_moisture_sensor_data WHERE id = ?";
        db.query(deleteQuery, [appId], (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(
              "Error deleting the irrigation application:",
              deleteError
            );
            res
              .status(500)
              .json({ message: "Error deleting the irrigation application" });
          } else {
            res
              .status(200)
              .json({ message: "Irrigation application deleted successfully" });
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling irrigation application deletion:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.post("/updateApplied/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Define the new value for the "applied" field (e.g., "yes")
        const newAppliedValue = "yes";

        // Perform the database update operation
        const updateQuery =
          "UPDATE soil_moisture_sensor_data SET applied = ? WHERE id = ?";
        db.query(
          updateQuery,
          [newAppliedValue, appId],
          (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating the applied field:", updateError);
              res
                .status(500)
                .json({ message: "Error updating the applied field" });
            } else {
              res
                .status(200)
                .json({ message: "Applied field updated successfully" });
            }
          }
        );
        db.release();
      } catch (error) {
        console.error("Error handling update of the applied field:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.post("/saveIrrigationApplicationTypeConfirmation", (req, res) => {
  setupDatabase().then((db) => {
    const { teamName, applicationType, isConfirmed } = req.body;

    // Replace this SQL with the correct SQL for your database schema
    const sql = `INSERT INTO IrrigationApplicationConfirmations (teamName, applicationType, isConfirmed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE isConfirmed = ?`;

    db.query(
      sql,
      [teamName, applicationType, isConfirmed, isConfirmed],
      (err, result) => {
        if (err) {
          console.error("Error saving data:", err);
          res.status(500).send("Error saving application type confirmation");
        } else {
          res
            .status(200)
            .send("Application type confirmation saved successfully");
        }
      }
    );
    db.release();
  });
});

router.get("/getIrrigationApplicationTypeConfirmation", (req, res) => {
  setupDatabase().then((db) => {
    const teamName = req.query.teamName; // Assume teamName is passed as a query parameter

    const sql = `SELECT applicationType, isConfirmed FROM IrrigationApplicationConfirmations WHERE teamName = ?`;

    db.query(sql, [teamName], (err, result) => {
      if (err) {
        res.status(500).send("Error fetching application type confirmation");
      } else {
        if (result.length === 0) {
          // No records found
          res
            .status(404)
            .send(
              "No application type confirmation found for the specified team"
            );
        } else {
          // Assuming you want to return the first result if multiple entries exist
          res.status(200).json(result[0]);
        }
      }
    });
    db.release();
  });
});

router.post("/saveMoistureApplicationTypeConfirmation", (req, res) => {
  setupDatabase().then((db) => {
    const { teamName, applicationType, isConfirmed } = req.body;

    // Replace this SQL with the correct SQL for your database schema
    const sql = `INSERT INTO MoistureApplicationConfirmations (teamName, applicationType, isConfirmed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE isConfirmed = ?`;

    db.query(
      sql,
      [teamName, applicationType, isConfirmed, isConfirmed],
      (err, result) => {
        if (err) {
          console.error("Error saving data:", err);
          res.status(500).send("Error saving application type confirmation");
        } else {
          res
            .status(200)
            .send("Application type confirmation saved successfully");
        }
      }
    );
    db.release();
  });
});

router.get("/getMoistureApplicationTypeConfirmation", (req, res) => {
  setupDatabase().then((db) => {
    const teamName = req.query.teamName; // Assume teamName is passed as a query parameter

    const sql = `SELECT applicationType, isConfirmed FROM MoistureApplicationConfirmations WHERE teamName = ?`;

    db.query(sql, [teamName], (err, result) => {
      if (err) {
        res.status(500).send("Error fetching application type confirmation");
      } else {
        if (result.length === 0) {
          // No records found
          res
            .status(404)
            .send(
              "No application type confirmation found for the specified team"
            );
        } else {
          // Assuming you want to return the first result if multiple entries exist
          res.status(200).json(result[0]);
        }
      }
    });
    db.release();
  });
});

// Export the router for use in your main Express app
module.exports = router;
