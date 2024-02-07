const mysql = require("mysql");

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "step_db",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

function setupDatabase() {
  return new Promise((resolve, reject) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection error: " + err.message);
        reject(err);
        return; // Exit the function on error
      }

      console.log("Connected to MySQL database");

      // Create the 'registration_data' and 'team_members' tables (if they don't exist)
      createTables(connection)
        .then(() => {
          resolve(connection); // Resolve with the connection object
        })
        .catch((err) => {
          connection.release(); // Release the connection on error
          console.error("Error creating tables: " + err.message);
          reject(err);
        });
    });
  });
}

function createTables(connection) {
  return new Promise((resolve, reject) => {
    // Create the 'registration_data' table for corn
    const createCornRegistrationTable = `
        CREATE TABLE IF NOT EXISTS corn_registration_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          teamName VARCHAR(255) NOT NULL,
          cropType VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          captainFirstName VARCHAR(255) NOT NULL,
          captainLastName VARCHAR(255) NOT NULL,
          address1 VARCHAR(255) NOT NULL,
          address2 VARCHAR(255),
          city VARCHAR(255),
          state VARCHAR(255),
          zipCode VARCHAR(255),
          country VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL
        )
      `;

    // Create the 'team_members' table for corn
    const createCornTeamMembersTable = `
        CREATE TABLE IF NOT EXISTS corn_team_members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          teamId INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          FOREIGN KEY (teamId) REFERENCES corn_registration_data(id)
        )
      `;

    // Create the 'registration_data' table for cotton
    const createCottonRegistrationTable = `
        CREATE TABLE IF NOT EXISTS cotton_registration_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          teamName VARCHAR(255) NOT NULL,
          cropType VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          captainFirstName VARCHAR(255) NOT NULL,
          captainLastName VARCHAR(255) NOT NULL,
          address1 VARCHAR(255) NOT NULL,
          address2 VARCHAR(255),
          city VARCHAR(255),
          state VARCHAR(255),
          zipCode VARCHAR(255),
          country VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL
        )
      `;

    // Create the 'team_members' table for cotton
    const createCottonTeamMembersTable = `
        CREATE TABLE IF NOT EXISTS cotton_team_members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          teamId INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          FOREIGN KEY (teamId) REFERENCES cotton_registration_data(id)
        )
      `;

    const createAdminsRegistrationTable = `
        CREATE TABLE IF NOT EXISTS admin_registration_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          superuser VARCHAR(255)

        )
      `;

    const createCropAdminTable = `
        CREATE TABLE IF NOT EXISTS admin_crops (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          FOREIGN KEY (userId) REFERENCES admin_registration_data(id)
        )
      `;

    const createCornHybridFormTable = `
      CREATE TABLE IF NOT EXISTS corn_hybrid_form (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teamName VARCHAR(255) NOT NULL,
        hybrid VARCHAR(255) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        notes TEXT
      )
    `;

    const createCottonHybridFormTable = `
      CREATE TABLE IF NOT EXISTS cotton_hybrid_form (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teamName VARCHAR(255) NOT NULL,
        hybrid VARCHAR(255) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        notes TEXT
      )
    `;

    const createSeedingRateFormTable = `
      CREATE TABLE IF NOT EXISTS seeding_rate_form (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teamName VARCHAR(255) NOT NULL,
        seedingRate VARCHAR(255) NOT NULL,
        notes TEXT,
        submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const cottoncreateSeedingRateFormTable = `
      CREATE TABLE IF NOT EXISTS cotton_seeding_rate_form (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teamName VARCHAR(255) NOT NULL,
        seedingRate VARCHAR(255) NOT NULL,
        notes TEXT,
        submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createNitrogenManagementFormTable = `
    CREATE TABLE IF NOT EXISTS nitrogen_management_form (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teamName VARCHAR(255) NOT NULL,
      applicationType VARCHAR(255) NOT NULL,
      placement VARCHAR(255),
      date DATE NOT NULL,
      amount VARCHAR(255) NOT NULL,
      applied VARCHAR(255),
      dateToday VARCHAR(255)
    )
  `;

    const cottoncreateNitrogenManagementFormTable = `
  CREATE TABLE IF NOT EXISTS cotton_nitrogen_management_form (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    applicationType VARCHAR(255) NOT NULL,
    placement VARCHAR(255),
    date DATE NOT NULL,
    amount VARCHAR(255) NOT NULL,
    applied VARCHAR(255),
    dateToday VARCHAR(255)
  )
`;

    const createApplicationConfirmationsTable = `
  CREATE TABLE IF NOT EXISTS ApplicationConfirmations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    applicationType VARCHAR(255) NOT NULL,
    isConfirmed BOOLEAN NOT NULL
  )
`;

    const createIrrigationApplicationConfirmationsTable = `
  CREATE TABLE IF NOT EXISTS IrrigationApplicationConfirmations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    applicationType VARCHAR(255) NOT NULL,
    isConfirmed BOOLEAN NOT NULL
  )
`;

    const createSoilApplicationConfirmationsTable = `
  CREATE TABLE IF NOT EXISTS MoistureApplicationConfirmations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    applicationType VARCHAR(255) NOT NULL,
    isConfirmed BOOLEAN NOT NULL
  )
`;

    const createCottonApplicationConfirmationsTable = `
  CREATE TABLE IF NOT EXISTS CottonApplicationConfirmations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    applicationType VARCHAR(255) NOT NULL,
    isConfirmed BOOLEAN NOT NULL
  )
`;

    const createSoilMoistureSensorTable = `
    CREATE TABLE IF NOT EXISTS soil_moisture_sensor_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teamName VARCHAR(255) NOT NULL,
      sensorType VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      reading VARCHAR(255) NOT NULL,
      options VARCHAR(255) NOT NULL,
      applied VARCHAR(255),
      dateToday VARCHAR(255)
    )
  `;

    const createCottonSoilMoistureSensorTable = `
    CREATE TABLE IF NOT EXISTS cotton_soil_moisture_sensor_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teamName VARCHAR(255) NOT NULL,
      sensorType VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      reading VARCHAR(255) NOT NULL,
      options VARCHAR(255) NOT NULL,
      applied VARCHAR(255),
      dateToday VARCHAR(255)
    )
  `;

    const createInsuranceSelectionTable = `
  CREATE TABLE IF NOT EXISTS insurance_selection_form (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    coverage VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL
  )
`;

    const createcottonInsuranceSelectionTable = `
  CREATE TABLE IF NOT EXISTS cotton_insurance_selection_form (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    coverage VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL
  )
`;

    const createMarketingOptionsTable = `
  CREATE TABLE IF NOT EXISTS marketing_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    contractType VARCHAR(255) NOT NULL,
    quantityBushels VARCHAR(255) NOT NULL,
    complete VARCHAR(255) NOT NULL,
    completedon VARCHAR(255),
    submitteddate VARCHAR(255)
  )
`;

    const createcottonMarketingOptionsTable = `
  CREATE TABLE IF NOT EXISTS cotton_marketing_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    contractType VARCHAR(255) NOT NULL,
    quantityBushels VARCHAR(255) NOT NULL,
    complete VARCHAR(255) NOT NULL
  )
`;

    const createcottonGrowthRegulationTable = `
CREATE TABLE IF NOT EXISTS cotton_growth_regulation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teamName VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  regulator VARCHAR(255) NOT NULL,
  rate VARCHAR(255) NOT NULL
)
`;
    const createPasswordResetTable = `
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    userType VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires BIGINT NOT NULL
  )
`;

    // Execute the CREATE TABLE queries
    connection.query(createCornRegistrationTable, (err) => {
      if (err) {
        reject(err);
      } else {
        connection.query(createCornTeamMembersTable, (err) => {
          if (err) {
            reject(err);
          } else {
            connection.query(createCottonRegistrationTable, (err) => {
              if (err) {
                reject(err);
              } else {
                connection.query(createCottonTeamMembersTable, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    connection.query(createAdminsRegistrationTable, (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        connection.query(createPasswordResetTable, (err) => {
                          if (err) {
                            reject(err);
                          } else {
                            connection.query(createCropAdminTable, (err) => {
                              if (err) {
                                reject(err);
                              } else {
                                connection.query(
                                  createCornHybridFormTable,
                                  (err) => {
                                    if (err) {
                                      reject(err);
                                    } else {
                                      connection.query(
                                        createCottonHybridFormTable,
                                        (err) => {
                                          if (err) {
                                            reject(err);
                                          } else {
                                            connection.query(
                                              createSeedingRateFormTable,
                                              (err) => {
                                                if (err) {
                                                  reject(err);
                                                } else {
                                                  connection.query(
                                                    cottoncreateSeedingRateFormTable,
                                                    (err) => {
                                                      if (err) {
                                                        reject(err);
                                                      } else {
                                                        connection.query(
                                                          createNitrogenManagementFormTable,
                                                          (err) => {
                                                            if (err) {
                                                              reject(err);
                                                            } else {
                                                              connection.query(
                                                                cottoncreateNitrogenManagementFormTable,
                                                                (err) => {
                                                                  if (err) {
                                                                    reject(err);
                                                                  } else {
                                                                    connection.query(
                                                                      createSoilMoistureSensorTable,
                                                                      (err) => {
                                                                        if (
                                                                          err
                                                                        ) {
                                                                          reject(
                                                                            err
                                                                          );
                                                                        } else {
                                                                          connection.query(
                                                                            createCottonSoilMoistureSensorTable,
                                                                            (
                                                                              err
                                                                            ) => {
                                                                              if (
                                                                                err
                                                                              ) {
                                                                                reject(
                                                                                  err
                                                                                );
                                                                              } else {
                                                                                connection.query(
                                                                                  createInsuranceSelectionTable,
                                                                                  (
                                                                                    err
                                                                                  ) => {
                                                                                    if (
                                                                                      err
                                                                                    ) {
                                                                                      reject(
                                                                                        err
                                                                                      );
                                                                                    } else {
                                                                                      connection.query(
                                                                                        createcottonInsuranceSelectionTable,
                                                                                        (
                                                                                          err
                                                                                        ) => {
                                                                                          if (
                                                                                            err
                                                                                          ) {
                                                                                            reject(
                                                                                              err
                                                                                            );
                                                                                          } else {
                                                                                            connection.query(
                                                                                              createMarketingOptionsTable,
                                                                                              (
                                                                                                err
                                                                                              ) => {
                                                                                                if (
                                                                                                  err
                                                                                                ) {
                                                                                                  reject(
                                                                                                    err
                                                                                                  );
                                                                                                } else {
                                                                                                  connection.query(
                                                                                                    createApplicationConfirmationsTable,
                                                                                                    (
                                                                                                      err
                                                                                                    ) => {
                                                                                                      if (
                                                                                                        err
                                                                                                      ) {
                                                                                                        reject(
                                                                                                          err
                                                                                                        );
                                                                                                      } else {
                                                                                                        connection.query(
                                                                                                          createIrrigationApplicationConfirmationsTable,
                                                                                                          (
                                                                                                            err
                                                                                                          ) => {
                                                                                                            if (
                                                                                                              err
                                                                                                            ) {
                                                                                                              reject(
                                                                                                                err
                                                                                                              );
                                                                                                            } else {
                                                                                                              connection.query(
                                                                                                                createSoilApplicationConfirmationsTable,
                                                                                                                (
                                                                                                                  err
                                                                                                                ) => {
                                                                                                                  if (
                                                                                                                    err
                                                                                                                  ) {
                                                                                                                    reject(
                                                                                                                      err
                                                                                                                    );
                                                                                                                  } else {
                                                                                                                    connection.query(
                                                                                                                      createCottonApplicationConfirmationsTable,
                                                                                                                      (
                                                                                                                        err
                                                                                                                      ) => {
                                                                                                                        if (
                                                                                                                          err
                                                                                                                        ) {
                                                                                                                          reject(
                                                                                                                            err
                                                                                                                          );
                                                                                                                        } else {
                                                                                                                          connection.query(
                                                                                                                            createcottonMarketingOptionsTable,
                                                                                                                            (
                                                                                                                              err
                                                                                                                            ) => {
                                                                                                                              if (
                                                                                                                                err
                                                                                                                              ) {
                                                                                                                                reject(
                                                                                                                                  err
                                                                                                                                );
                                                                                                                              } else {
                                                                                                                                connection.query(
                                                                                                                                  createcottonGrowthRegulationTable,
                                                                                                                                  (
                                                                                                                                    err
                                                                                                                                  ) => {
                                                                                                                                    if (
                                                                                                                                      err
                                                                                                                                    ) {
                                                                                                                                      reject(
                                                                                                                                        err
                                                                                                                                      );
                                                                                                                                    } else {
                                                                                                                                      resolve();
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                );
                                                                                                                              }
                                                                                                                            }
                                                                                                                          );
                                                                                                                        }
                                                                                                                      }
                                                                                                                    );
                                                                                                                  }
                                                                                                                }
                                                                                                              );
                                                                                                            }
                                                                                                          }
                                                                                                        );
                                                                                                      }
                                                                                                    }
                                                                                                  );
                                                                                                }
                                                                                              }
                                                                                            );
                                                                                          }
                                                                                        }
                                                                                      );
                                                                                    }
                                                                                  }
                                                                                );
                                                                              }
                                                                            }
                                                                          );
                                                                        }
                                                                      }
                                                                    );
                                                                  }
                                                                }
                                                              );
                                                            }
                                                          }
                                                        );
                                                      }
                                                    }
                                                  );
                                                }
                                              }
                                            );
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

module.exports = { setupDatabase };
