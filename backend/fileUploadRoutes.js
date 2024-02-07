const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the target directories for file uploads
const uploadsDir = "./uploads";
const insuranceUploadsDir = "./uploads/insurance";
const marketingOptionsUploadsDir = "./uploads/marketingOptions";
const defaultUploadsDir = "./uploads/default";
const cottoninsuranceUploadsDir = "./uploads/cottoninsurance";
const cottonmarketingOptionsUploadsDir = "./uploads/cottonmarketingOptions";
const cottondefaultUploadsDir = "./uploads/cottondefault";

// Ensure the target directories exist; create them if they don't
ensureDirectoryExists(uploadsDir);
ensureDirectoryExists(insuranceUploadsDir);
ensureDirectoryExists(marketingOptionsUploadsDir);
ensureDirectoryExists(defaultUploadsDir);
ensureDirectoryExists(cottoninsuranceUploadsDir);
ensureDirectoryExists(cottonmarketingOptionsUploadsDir);
ensureDirectoryExists(cottondefaultUploadsDir);

// Function to ensure a directory exists; create it if it doesn't
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder for uploaded files based on the route
    let uploadDir;

    if (req.originalUrl === "/api/uploadInsuranceFile") {
      uploadDir = "./uploads/insurance";
    } else if (req.originalUrl === "/api/uploadMarketingOptionsFile") {
      uploadDir = "./uploads/marketingOptions";
    } else {
      // Handle invalid routes or provide a default destination
      uploadDir = "./uploads/default"; // Change this to your preferred default destination
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded files
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// Function to save file metadata to a JSON file
function saveFileMetadata(directory, metadata) {
  const metadataFilePath = path.join(directory, "metadata.json");

  fs.readFile(metadataFilePath, (err, data) => {
    let metadataArray = [];

    if (!err && data) {
      metadataArray = JSON.parse(data);
    }

    metadataArray.push(metadata);

    fs.writeFile(
      metadataFilePath,
      JSON.stringify(metadataArray, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing metadata:", err);
        }
      }
    );
  });
}

router.post("/uploadDefaultFile", upload.single("defaultFile"), (req, res) => {
  try {
    // Access the uploaded file information
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const originalFileName = file.originalname;
    const savePath = path.join(defaultUploadsDir, originalFileName);
    const fileMetadata = {
      originalFileName: file.originalname,
      uploadDate: new Date().toISOString(),
    };

    // You can process the uploaded file here or save it to a database
    fs.rename(file.path, savePath, (err) => {
      if (err) {
        console.error("Error saving the uploaded file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      saveFileMetadata(defaultUploadsDir, fileMetadata);
      res.status(200).json({ message: "File uploaded successfully" });
    });
    // res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define routes for handling file uploads
router.post(
  "/uploadInsuranceFile",
  upload.single("insuranceFile"),
  (req, res) => {
    try {
      // Access the uploaded file information
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const originalFileName = file.originalname;
      const savePath = path.join(insuranceUploadsDir, originalFileName);
      const fileMetadata = {
        originalFileName: file.originalname,
        uploadDate: new Date().toISOString(),
      };

      // You can process the uploaded file here or save it to a database
      fs.rename(file.path, savePath, (err) => {
        if (err) {
          console.error("Error saving the uploaded file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        saveFileMetadata(insuranceUploadsDir, fileMetadata);
        res.status(200).json({ message: "File uploaded successfully" });
      });
      // res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/uploadMarketingOptionsFile",
  upload.single("marketingOptionsFile"),
  (req, res) => {
    try {
      // Access the uploaded file information
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const originalFileName = file.originalname;
      const savePath = path.join(marketingOptionsUploadsDir, originalFileName);
      const fileMetadata = {
        originalFileName: file.originalname,
        uploadDate: new Date().toISOString(),
      };
      // You can process the uploaded file here or save it to a database
      fs.rename(file.path, savePath, (err) => {
        if (err) {
          console.error("Error saving the uploaded file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        saveFileMetadata(marketingOptionsUploadsDir, fileMetadata);

        res.status(200).json({ message: "File uploaded successfully" });
      });

      // You can process the uploaded file here or save it to a database

      // res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/uploadCottonDefaultFile",
  upload.single("cottondefaultFile"),
  (req, res) => {
    try {
      // Access the uploaded file information
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const originalFileName = file.originalname;
      const savePath = path.join(cottondefaultUploadsDir, originalFileName);
      const fileMetadata = {
        originalFileName: file.originalname,
        uploadDate: new Date().toISOString(),
      };

      // You can process the uploaded file here or save it to a database
      fs.rename(file.path, savePath, (err) => {
        if (err) {
          console.error("Error saving the uploaded file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        saveFileMetadata(cottondefaultUploadsDir, fileMetadata);
        res.status(200).json({ message: "File uploaded successfully" });
      });
      // res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/uploadCottonInsuranceFile",
  upload.single("insuranceFile"),
  (req, res) => {
    try {
      // Access the uploaded file information
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const originalFileName = file.originalname;
      const savePath = path.join(cottoninsuranceUploadsDir, originalFileName);
      const fileMetadata = {
        originalFileName: file.originalname,
        uploadDate: new Date().toISOString(),
      };
      // You can process the uploaded file here or save it to a database
      fs.rename(file.path, savePath, (err) => {
        if (err) {
          console.error("Error saving the uploaded file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        saveFileMetadata(cottoninsuranceUploadsDir, fileMetadata);
        res.status(200).json({ message: "File uploaded successfully" });
      });
      // res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/uploadCottonMarketingOptionsFile",
  upload.single("marketingOptionsFile"),
  (req, res) => {
    try {
      // Access the uploaded file information
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const originalFileName = file.originalname;
      const savePath = path.join(
        cottonmarketingOptionsUploadsDir,
        originalFileName
      );
      const fileMetadata = {
        originalFileName: file.originalname,
        uploadDate: new Date().toISOString(),
      };
      // You can process the uploaded file here or save it to a database
      fs.rename(file.path, savePath, (err) => {
        if (err) {
          console.error("Error saving the uploaded file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        saveFileMetadata(cottonmarketingOptionsUploadsDir, fileMetadata);
        res.status(200).json({ message: "File uploaded successfully" });
      });

      // You can process the uploaded file here or save it to a database

      // res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const uploads = multer({ dest: "temp_uploads/" });

// Route for file upload
router.post("/upload", uploads.single("file"), (req, res) => {
  const file = req.file;
  const teamName = req.body.teamName;
  const cropType = req.body.cropType;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const uploadDir = path.join(__dirname, "uploads", cropType, teamName);
  ensureDirectoryExists(uploadDir);

  const finalPath = path.join(uploadDir, file.originalname);

  // Move the file from the temporary directory to the final destination
  fs.rename(file.path, finalPath, (err) => {
    if (err) {
      console.error("Error moving the file:", err);
      return res.status(500).send("Error saving the file.");
    }
    res.send("File uploaded and saved successfully.");
  });
});

router.post("/uploadimg", uploads.single("file"), (req, res) => {
  const file = req.file;
  const teamName = req.body.teamName;
  const cropType = req.body.cropType;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  // Set the filename as 'profile.jpg'
  const filename = "profile.jpg";

  const uploadDir = path.join(__dirname, "uploads", cropType, teamName);
  ensureDirectoryExists(uploadDir);

  const finalPath = path.join(uploadDir, filename);

  // Move the file from the temporary directory to the final destination
  fs.rename(file.path, finalPath, (err) => {
    if (err) {
      console.error("Error moving the file:", err);
      return res.status(500).send("Error saving the file.");
    }
    res.send("Profile image uploaded and saved successfully.");
  });
});

function updateMetadata(metadataFilePath, fileName, res) {
  fs.readFile(metadataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading metadata file:", err);
      return res.status(500).json({ message: "Error reading metadata file" });
    }

    try {
      let metadata = JSON.parse(data);
      // Filter out the deleted file's metadata
      metadata = metadata.filter((file) => file.originalFileName !== fileName);

      // Write the updated metadata back to the file
      fs.writeFile(
        metadataFilePath,
        JSON.stringify(metadata, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing metadata file:", err);
            return res
              .status(500)
              .json({ message: "Error updating metadata file" });
          }

          res
            .status(200)
            .json({ message: "File and metadata deleted successfully" });
        }
      );
    } catch (parseError) {
      console.error("Error parsing metadata file:", parseError);
      res.status(500).json({ message: "Error parsing metadata file" });
    }
  });
}

router.delete("/deleteTeamFile/:teamName/:fileName", (req, res) => {
  const { teamName, fileName } = req.params;
  const filePath = path.join(__dirname, "uploads", "corn", teamName, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        res.status(500).send("Error deleting the file");
      } else {
        res.send("File deleted successfully");
      }
    });
  } else {
    res.status(404).send("File not found.");
  }
});

router.delete("/deleteCottonTeamFile/:teamName/:fileName", (req, res) => {
  const { teamName, fileName } = req.params;
  const filePath = path.join(
    __dirname,
    "uploads",
    "cotton",
    teamName,
    fileName
  );

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        res.status(500).send("Error deleting the file");
      } else {
        res.send("File deleted successfully");
      }
    });
  } else {
    res.status(404).send("File not found.");
  }
});

router.delete("/deletedefaultFile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(defaultUploadsDir, fileName); // Adjust the path as needed
  const metadataFilePath = path.join(defaultUploadsDir, "metadata.json");

  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Update metadata.json
      updateMetadata(metadataFilePath, fileName, res);
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.delete("/deleteinsuranceFile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(insuranceUploadsDir, fileName); // Adjust the path as needed
  const metadataFilePath = path.join(insuranceUploadsDir, "metadata.json");

  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Update metadata.json
      updateMetadata(metadataFilePath, fileName, res);
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.delete("/deletemarketingFile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(marketingOptionsUploadsDir, fileName); // Adjust the path as needed
  const metadataFilePath = path.join(
    marketingOptionsUploadsDir,
    "metadata.json"
  );

  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Update metadata.json
      updateMetadata(metadataFilePath, fileName, res);
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.delete("/deletecottoninsuranceFile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(cottoninsuranceUploadsDir, fileName); // Adjust the path as needed
  const metadataFilePath = path.join(
    cottoninsuranceUploadsDir,
    "metadata.json"
  );

  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Update metadata.json
      updateMetadata(metadataFilePath, fileName, res);
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.delete("/deletecottonmarketingFile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(cottonmarketingOptionsUploadsDir, fileName); // Adjust the path as needed
  const metadataFilePath = path.join(
    cottonmarketingOptionsUploadsDir,
    "metadata.json"
  );

  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Update metadata.json
      updateMetadata(metadataFilePath, fileName, res);
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.delete("/deletecottondefaultFile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(cottondefaultUploadsDir, fileName); // Adjust the path as needed
  const metadataFilePath = path.join(cottondefaultUploadsDir, "metadata.json");

  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Update metadata.json
      updateMetadata(metadataFilePath, fileName, res);
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;
