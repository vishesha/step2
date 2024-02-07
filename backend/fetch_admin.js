const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database"); // Import the setupDatabase function

router.get("/getAdmin", (req, res) => {
  setupDatabase()
    .then((db) => {
      // Query to fetch admin data
      const queryAdmins = "SELECT * FROM admin_registration_data";

      db.query(queryAdmins, (err, admins) => {
        if (err) {
          console.error("Error fetching admins:", err);
          res.status(500).json({ message: "Error fetching admins" });
          return;
        }

        // Loop through each admin to fetch their crops
        let fetchCropsPromises = admins.map((admin) => {
          return new Promise((resolve, reject) => {
            const queryCrops = "SELECT * FROM admin_crops WHERE userId = ?";
            db.query(queryCrops, [admin.id], (err, crops) => {
              if (err) {
                reject(err);
                return;
              }
              resolve({ ...admin, crops });
            });
          });
        });

        // Resolve all promises and send the response
        Promise.all(fetchCropsPromises)
          .then((results) => {
            res.json(results);
          })
          .catch((error) => {
            console.error("Error fetching crops for admins:", error);
            res
              .status(500)
              .json({ message: "Error fetching crops for admins" });
          });
      });
      db.release();
    })
    .catch((error) => {
      console.error("Database setup error:", error);
      res.status(500).json({ message: "Database setup error" });
    });
});

module.exports = router;
