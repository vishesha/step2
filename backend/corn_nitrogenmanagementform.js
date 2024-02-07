// backend/routes/nitrogen_management_form.js
const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saduvishesha123@gmail.com", // Replace with your email
    pass: "oaqd javu lnna brhz", // Replace with your email password or app password
  },
});

// Define a route for handling nitrogen management form submissions
router.post("/nitrogenmanagementsubmit", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body and session
        const {
          applicationType,
          placement,
          date,
          amount,
          teamName,
          applied,
          dateToday,
        } = req.body;

        // Insert a new row without checking for duplicates
        const insertQuery =
          "INSERT INTO nitrogen_management_form (teamName, applicationType, placement, date, amount,applied,dateToday) VALUES (?, ?, ?, ?, ?, ?,?)";
        db.query(
          insertQuery,
          [
            teamName,
            applicationType,
            placement,
            date,
            amount,
            applied,
            dateToday,
          ], // Updated parameter list
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

router.get("/fetchNitrogenManagementData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the applicationType from the query parameters
        const { applicationType, teamName } = req.query;

        // Query the database based on the applicationType
        const query =
          "SELECT * FROM nitrogen_management_form WHERE applicationType = ? and teamName = ?";
        db.query(query, [applicationType, teamName], (error, results) => {
          if (error) {
            console.error("Error fetching data from the database:", error);
            res.status(500).json({ message: "Error fetching data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.get("/fetchAllNitrogenManagementData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the applicationType from the query parameters

        // Query the database based on the applicationType
        const query = "SELECT * FROM nitrogen_management_form";
        db.query(query, (error, results) => {
          if (error) {
            console.error("Error fetching data from the database:", error);
            res.status(500).json({ message: "Error fetching data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.delete("/deletenitrogenApplication/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Perform the database delete operation based on the appId
        const deleteQuery = "DELETE FROM nitrogen_management_form WHERE id = ?";
        db.query(deleteQuery, [appId], (deleteError, deleteResult) => {
          if (deleteError) {
            console.error("Error deleting the application:", deleteError);
            res.status(500).json({ message: "Error deleting the application" });
          } else {
            res
              .status(200)
              .json({ message: "Application deleted successfully" });
          }
        });
        db.release();
      } catch (error) {
        console.error("Error handling application deletion:", error);
        res.status(500).json({ message: "Internal server error" });
        db.release();
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// router.post("/updateNitrogenApplied/:appId", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       try {
//         // Extract the application ID from the request parameters
//         const appId = req.params.appId;

//         // Define the new value for the "applied" field (e.g., "yes")
//         const newAppliedValue = "yes";

//         // Perform the database update operation
//         const updateQuery =
//           "UPDATE nitrogen_management_form SET applied = ? WHERE id = ?";
//         db.query(
//           updateQuery,
//           [newAppliedValue, appId],
//           (updateError, updateResult) => {
//             if (updateError) {
//               console.error("Error updating the applied field:", updateError);
//               res
//                 .status(500)
//                 .json({ message: "Error updating the applied field" });
//             } else {
//               res
//                 .status(200)
//                 .json({ message: "Applied field updated successfully" });
//             }
//           }
//         );
//       } catch (error) {
//         console.error("Error handling update of the applied field:", error);
//         res.status(500).json({ message: "Internal server error" });
//       }
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

// ... Other imports and route setup ...

router.post("/updateNitrogenApplied/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Define the new value for the "applied" field (e.g., "yes")
        const newAppliedValue = "yes";

        // Fetch the team name associated with the application ID
        const fetchTeamNameQuery =
          "SELECT teamName FROM nitrogen_management_form WHERE id = ?";
        db.query(fetchTeamNameQuery, [appId], (fetchError, fetchResult) => {
          if (fetchError) {
            console.error("Error fetching team name:", fetchError);
            res.status(500).json({ message: "Error fetching team name" });
          } else if (fetchResult.length === 0) {
            res.status(404).json({ message: "Application not found" });
          } else {
            const teamName = fetchResult[0].teamName;

            // Perform the database update operation
            const updateQuery =
              "UPDATE nitrogen_management_form SET applied = ? WHERE id = ?";
            db.query(
              updateQuery,
              [newAppliedValue, appId],
              async (updateError, updateResult) => {
                if (updateError) {
                  console.error(
                    "Error updating the applied field:",
                    updateError
                  );
                  res
                    .status(500)
                    .json({ message: "Error updating the applied field" });
                } else {
                  // Fetch the recipient's email address based on the team name
                  const fetchEmailQuery =
                    "SELECT email FROM corn_registration_data WHERE teamName = ?";
                  db.query(
                    fetchEmailQuery,
                    [teamName],
                    async (emailError, emailResult) => {
                      if (emailError) {
                        console.error("Error fetching email:", emailError);
                        res.status(500).json({
                          message: "Error fetching recipient's email",
                        });
                      } else if (emailResult.length === 0) {
                        res
                          .status(404)
                          .json({ message: "Recipient's email not found" });
                      } else {
                        const recipientEmail = emailResult[0].email;
                        let emailText = `The application with ID ${appId} has been marked as applied.`;
                        const fetchApplicationDetailsQuery =
                          "SELECT * FROM nitrogen_management_form WHERE id = ?";
                        await db.query(
                          fetchApplicationDetailsQuery,
                          [appId],
                          (detailsError, detailsResult) => {
                            if (detailsError) {
                              console.error(
                                "Error fetching application details:",
                                detailsError
                              );
                              res.status(500).json({
                                message: "Error fetching application details",
                              });
                            } else if (detailsResult.length === 0) {
                              res.status(404).json({
                                message: "Application details not found",
                              });
                            } else {
                              const applicationDetails = detailsResult[0];
                              const {
                                applicationType,
                                placement,
                                date,
                                dateToday,
                              } = applicationDetails;

                              // Compose the email text
                              emailText = `Hello ${teamName},\n\nThe nitrogen application of corn crop with application type: ${applicationType}, placement type: ${placement}, for date ${date} requested on ${dateToday} is confirmed.`;

                              // Send an email when the "applied" field is updated successfully

                              console.log(recipientEmail);
                              const mailOptions = {
                                from: "saduvishesha123@gmail.com",
                                to: recipientEmail, // Use the fetched recipient's email address
                                subject: "Nitrogen Application Status Update",
                                text: emailText,
                              };
                              try {
                                const info = transporter.sendMail(mailOptions);
                                console.log("Email sent: " + mailOptions.text);
                              } catch (error) {
                                console.error("Email sending error: ", error);
                              }
                            }
                          }
                        );

                        res.status(200).json({
                          message:
                            "Applied field updated successfully and email sent",
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
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

router.post("/saveApplicationTypeConfirmation", (req, res) => {
  setupDatabase().then((db) => {
    const { teamName, applicationType, isConfirmed } = req.body;

    // Replace this SQL with the correct SQL for your database schema
    const sql = `INSERT INTO ApplicationConfirmations (teamName, applicationType, isConfirmed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE isConfirmed = ?`;

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

router.get("/getApplicationTypeConfirmation", (req, res) => {
  setupDatabase().then((db) => {
    const teamName = req.query.teamName; // Assume teamName is passed as a query parameter

    const sql = `SELECT applicationType, isConfirmed FROM ApplicationConfirmations WHERE teamName = ?`;

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
