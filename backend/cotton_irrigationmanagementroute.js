const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Define a route for handling soil moisture sensor submissions
router.post("/cottonsoilmoisturesensorsubmit", (req, res) => {
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
          "INSERT INTO cotton_soil_moisture_sensor_data (teamName, sensorType, date, reading,options,applied, dateToday) VALUES (?, ?, ?, ?,?,?,?)";
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
router.get("/cottonfetchSoilMoistureSensorData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        const { teamName } = req.query;
        // Query the database to fetch all soil moisture sensor data
        const query =
          "SELECT * FROM cotton_soil_moisture_sensor_data WHERE teamName = ?";
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

router.get("/cottonfetchAllSoilMoistureSensorData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Query the database to fetch all soil moisture sensor data
        const query = "SELECT * FROM cotton_soil_moisture_sensor_data";
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

router.delete("/deletecottonirrigationApplication/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Perform the database delete operation
        const deleteQuery =
          "DELETE FROM cotton_soil_moisture_sensor_data WHERE id = ?";
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

router.post("/updateCottonApplied/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Define the new value for the "applied" field (e.g., "yes")
        const newAppliedValue = "yes";

        // Perform the database update operation
        const updateQuery =
          "UPDATE cotton_soil_moisture_sensor_data SET applied = ? WHERE id = ?";
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

// Export the router for use in your main Express app
module.exports = router;
