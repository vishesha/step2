const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database"); // Import the setupDatabase function
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// const bcrypt = require("bcrypt");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saduvishesha123@gmail.com", // Replace with your email
    pass: "oaqd javu lnna brhz", // Replace with your email password or app password
  },
});

// Registration API
router.post("/register", async (req, res) => {
  const formData = req.body;
  const cropType = formData.cropType;

  setupDatabase()
    .then((db) => {
      // Define the SQL statements and values based on the crop type
      let registrationSql, teamMembersSql;
      let registrationValues, teamMembersValues;

      if (cropType === "corn") {
        // If cropType is 'corn', insert into 'corn_registration_data' and 'corn_team_members' tables
        registrationSql = `
            INSERT INTO corn_registration_data (teamName, cropType, password, captainFirstName, captainLastName, address1, address2, city, state, zipCode, country, email, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
        teamMembersSql = `
            INSERT INTO corn_team_members (teamId, name, email)
            VALUES (?, ?, ?)
          `;
      } else if (cropType === "cotton") {
        // If cropType is 'cotton', insert into 'cotton_registration_data' and 'cotton_team_members' tables
        registrationSql = `
            INSERT INTO cotton_registration_data (teamName, cropType, password, captainFirstName, captainLastName, address1, address2, city, state, zipCode, country, email, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
        teamMembersSql = `
            INSERT INTO cotton_team_members (teamId, name, email)
            VALUES (?, ?, ?)
          `;
      } else {
        // Handle unsupported crop types here, if necessary
        res.status(400).json({ message: "Unsupported crop type" });
        return;
      }

      // Values for the registration data insertion
      registrationValues = [
        formData.teamName,
        formData.cropType,
        formData.password,
        formData.captainFirstName,
        formData.captainLastName,
        formData.address1,
        formData.address2,
        formData.city,
        formData.state,
        formData.zipCode,
        formData.country,
        formData.email,
        formData.phone,
      ];

      // Insert registration data into the respective registration table
      db.query(registrationSql, registrationValues, (err, result) => {
        if (err) {
          console.error("Error inserting registration data: " + err.message);
          res.status(500).json({ message: "Registration failed" });
        } else {
          const teamId = result.insertId;

          // Insert team members into the respective team members table
          formData.teamMembers.forEach((member) => {
            teamMembersValues = [teamId, member.name, member.email];

            db.query(teamMembersSql, teamMembersValues, (err) => {
              if (err) {
                console.error("Error inserting team member: " + err.message);
              }
            });
          });
          let emailContent = `You have been successfully registered .\nUsername && Team name: ${formData.teamName}\n`;
          emailContent += `Crop: ${formData.cropType}\n`; // Do not send the actual password
          emailContent += `Email: ${formData.email}\n`;
          emailContent += `Password: ${formData.password}\n`;

          const mailOptions = {
            from: "saduvishesha123@gmail.com",
            to: formData.email,
            subject: "Registration Successful",
            text: emailContent,
          };

          try {
            const info = transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
          } catch (error) {
            console.error("Email sending error: ", error);
          }

          res.status(201).json({ message: "Registration successful" });
        }
      });
      db.release();
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.post("/forgot-password", async (req, res) => {
  setupDatabase().then((db) => {
    const { username, cropType } = req.body;

    // Choose the correct table based on the cropType
    const userTable =
      cropType === "corn"
        ? "corn_registration_data"
        : "cotton_registration_data";

    // SQL to get the email of the user
    const getEmailSql = `SELECT email FROM ${userTable} WHERE teamName = ?`;

    db.query(getEmailSql, [username], (err, result) => {
      if (err) {
        console.error("Database error: " + err.message);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const email = result[0].email;

      // Generate a secure token
      const token = crypto.randomBytes(20).toString("hex");
      const expirationTime = Date.now() + 3600000; // 1 hour in milliseconds

      // Assuming you have a separate table for reset tokens
      const insertTokenSql = `
      INSERT INTO password_reset_tokens (userId, userType, token, expires)
      VALUES ((SELECT id FROM ${userTable} WHERE teamName = ?), ?, ?, ?)
    `;

      db.query(
        insertTokenSql,
        [username, cropType, token, expirationTime],
        (err, result) => {
          if (err) {
            console.error("Error storing token: " + err.message);
            res.status(500).json({ message: "Error processing request" });
            return;
          }

          // Sending email
          const resetLink = `http://localhost:3000/reset-password?token=${token}`;
          const mailOptions = {
            from: "saduvishesha123@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `Please use the following link to reset your password: ${resetLink}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email: ", error);
              res.status(500).json({ message: "Error sending reset email" });
            } else {
              console.log("Email sent: " + info.response);
              res
                .status(200)
                .json({ message: `Password reset email sent to ${email}` });
            }
          });
        }
      );
    });
    db.release();
  });
});

router.post("/reset-password", async (req, res) => {
  setupDatabase().then((db) => {
    const { token, newPassword } = req.body;

    // SQL to get the user information based on the token
    const tokenSql = `
    SELECT userId, userType, expires FROM password_reset_tokens 
    WHERE token = ?
  `;

    db.query(tokenSql, [token], async (err, tokenResults) => {
      if (err) {
        console.error("Error querying token: " + err.message);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (tokenResults.length === 0 || tokenResults[0].expires < Date.now()) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
      }

      const { userId, userType } = tokenResults[0];
      const userTable =
        userType === "corn"
          ? "corn_registration_data"
          : "cotton_registration_data";

      try {
        // const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // SQL to update the user's password
        const updatePasswordSql = `
        UPDATE ${userTable}
        SET password = ?
        WHERE id = ?
      `;

        db.query(
          updatePasswordSql,
          [newPassword, userId],
          (err, updateResult) => {
            if (err) {
              console.error("Error updating password: " + err.message);
              res.status(500).json({ message: "Error updating password" });
              return;
            }

            if (updateResult.affectedRows === 0) {
              res.status(404).json({ message: "User not found" });
              return;
            }

            // Optionally, delete the token from the database
            const deleteTokenSql = `DELETE FROM password_reset_tokens WHERE token = ?`;
            db.query(deleteTokenSql, [token], (err) => {
              if (err) {
                console.error("Error deleting token: " + err.message);
                // Not sending error response here as the main operation has succeeded
              }
            });

            res.status(200).json({ message: "Password reset successfully" });
          }
        );
      } catch (hashError) {
        console.error("Error hashing new password: " + hashError.message);
        res.status(500).json({ message: "Error processing request" });
      }
    });
    db.release();
  });
});

module.exports = router;
