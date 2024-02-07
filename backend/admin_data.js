// Import the setupDatabase function
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setupDatabase } = require("./database");
const nodemailer = require("nodemailer");
const { setupDatabaseMiddleware } = require("./database");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saduvishesha123@gmail.com", // Replace with your email
    pass: "oaqd javu lnna brhz", // Replace with your email password or app password
  },
});

const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");

  try {
    const tokenWithoutBearer = token.split(" ")[1];
    const verified = jwt.verify(
      tokenWithoutBearer,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.adminId = verified.id; // Assuming the JWT contains the admin ID
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

router.get("/getAdminCrops", authenticateAdmin, async (req, res) => {
  const adminId = req.adminId; // Get the admin ID from the authenticated user

  try {
    const db = await setupDatabase();
    const query = "SELECT name FROM admin_crops WHERE userId = ?";

    db.query(query, [adminId], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send("Internal server error");
      }

      const crops = results.map((row) => row.name);
      res.json({ crops });
    });
    db.release();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send("Failed to connect to the database");
    db.release();
  }
});

// Admin Registration API
router.post("/registerAdmin", async (req, res) => {
  const adminData = req.body.adminData;
  const crops = req.body.crops;
  try {
    const db = await setupDatabase();
    // Define the SQL statement for inserting admin data
    let adminSql = `
        INSERT INTO admin_registration_data (username, password, email, phone)
        VALUES (?, ?, ?, ?)
      `;
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    // Values for the admin data insertion
    let adminValues = [
      adminData.username,
      hashedPassword, // Ensure this is hashed in a real-world scenario
      adminData.email,
      adminData.phone,
    ];

    // Insert admin data into the admin_registration_data table
    db.query(adminSql, adminValues, async (err, result) => {
      if (err) {
        console.error("Error inserting admin data: " + err.message);
        res.status(500).json({ message: "Admin registration failed" });
        return;
      }

      // Get the admin ID from the inserted row
      const adminId = result.insertId;

      let emailContent = `You have been successfully registered as an admin.\nUsername: ${adminData.username}\n`;
      emailContent += `Password: ${adminData.password}\n`; // Do not send the actual password
      emailContent += `Email: ${adminData.email}\n`;
      emailContent += `Phone: ${adminData.phone}\n`;
      emailContent += `Crop Types: ${crops.join(", ")}`;

      // Send an email with registration details
      const mailOptions = {
        from: "saduvishesha123@gmail.com",
        to: adminData.email,
        subject: "Admin Registration Successful",
        text: emailContent,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
      } catch (error) {
        console.error("Email sending error: ", error);
      }

      // Prepare and execute queries for each crop
      crops.forEach((crop) => {
        if (crop) {
          let cropSql = `
              INSERT INTO admin_crops (userId, name)
              VALUES (?, ?)
            `;
          let cropValues = [adminId, crop];

          db.query(cropSql, cropValues, (err) => {
            if (err) {
              console.error("Error inserting crop data: " + err.message);
              // Handle crop insertion error
            }
          });
        }
      });

      res.status(201).json({ message: "successful" });
    });
    db.release();
  } catch (err) {
    console.error("Database setup error: " + err.message);
    res.status(500).json({ message: "Database setup error" });
    db.release();
  }
});

router.post("/adminlogin", (req, res) => {
  const { username, password, cropType } = req.body;

  // Step 1: Validate input
  if (!username || !password || !cropType) {
    return res
      .status(400)
      .json({ message: "Username, password, and crop are required" });
  }

  // Step 2: Check if the user exists in the database and the crop type matches
  setupDatabase()
    .then((db) => {
      const query = `
            SELECT admin.*, crop.name AS cropName 
            FROM admin_registration_data admin
            INNER JOIN admin_crops crop ON admin.id = crop.userId
            WHERE admin.username = ? AND crop.name = ?
        `;
      db.query(query, [username, cropType], async (err, results) => {
        if (err) {
          console.error("Database query error: " + err.message);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];

        // Step 3: Compare the hashed password
        try {
          if (await bcrypt.compare(password, user.password)) {
            // Passwords and crop type match
            // Generate a token if using JWT
            const accessToken = jwt.sign(
              { id: user.id, username: user.username, crop: user.cropName },
              process.env.ACCESS_TOKEN_SECRET
            );

            return res
              .status(200)
              .json({ message: "Login successful", accessToken: accessToken });
          } else {
            // Passwords do not match
            return res.status(401).json({ message: "Invalid credentials" });
          }
        } catch (compareError) {
          console.error("Password compare error: " + compareError.message);
          return res
            .status(500)
            .json({ message: compareError.message + "Internal server error" });
        }
      });
      db.release();
    })
    .catch((dbError) => {
      console.error("Database setup error: " + dbError.message);
      res.status(500).json({ message: "Database setup error" });
      db.release();
    });
});

router.delete("/deleteAdmin/:id", async (req, res) => {
  const adminId = req.params.id;

  try {
    const db = await setupDatabase();

    // Begin transaction
    await db.beginTransaction();

    // Delete crops associated with the admin
    const deleteCropsSql = "DELETE FROM admin_crops WHERE userId = ?";
    await db.query(deleteCropsSql, [adminId]);

    // Delete the admin
    const deleteAdminSql = "DELETE FROM admin_registration_data WHERE id = ?";
    await db.query(deleteAdminSql, [adminId]);

    // Commit transaction
    await db.commit();

    res.send("Admin and associated crops successfully deleted");

    db.release();
  } catch (error) {
    // Rollback transaction in case of error
    await db.rollback();
    db.release();

    console.error("Error deleting admin:", error);
    res.status(500).send("Failed to delete admin");
  }
});

router.get("/adminDetails", (req, res) => {
  const { adminId } = req.query; // Assuming the admin ID is passed as a query parameter

  if (!adminId) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  setupDatabase().then((db) => {
    const query = "SELECT * FROM admin_registration_data WHERE id = ?";
    db.query(query, [adminId], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json(results[0]); // Send the admin details
    });
    db.release();
  });
});

module.exports = router;
