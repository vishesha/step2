const express = require("express");
const session = require("express-session"); // Import the express-session middleware
const router = express.Router();
const { setupDatabase } = require("./database"); // Import the setupDatabase function

// Login API
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const cropType = req.body.cropType;

  setupDatabase()
    .then((db) => {
      let loginSql;
      let loginValues;

      // Define SQL statement to select user based on cropType
      if (cropType === "corn") {
        loginSql = "SELECT * FROM corn_registration_data WHERE teamName = ?";
        loginValues = [username];
      } else if (cropType === "cotton") {
        loginSql = "SELECT * FROM cotton_registration_data WHERE teamName = ?";
        loginValues = [username];
      } else {
        res.status(400).json({ message: "Unsupported crop type" });
        return;
      }

      // Query the database to check if the user exists
      db.query(loginSql, loginValues, (err, users) => {
        if (err) {
          console.error("Error during login query: " + err.message);
          res.status(500).json({ message: "Login query failed" });
          return;
        }

        if (users.length === 0) {
          // No user found with the given username
          res
            .status(401)
            .json({ message: "Invalid credentials. User does not exist." });
        } else {
          // User found, check password
          const user = users[0];
          if (user.password === password) {
            // Successful login
            req.session.username = username;
            req.session.cropType = cropType;
            res.status(200).json({ message: "Login successful", user });
          } else {
            // Password does not match
            res.status(401).json({
              message: "Invalid credentials. Please check your password.",
            });
          }
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

// ... Other routes ...
