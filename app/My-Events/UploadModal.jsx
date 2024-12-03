import React, { useEffect, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import Alert from "@mui/material/Alert";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  IconButton 
} from '@mui/material';
import Button from "@mui/material/Button";
import axios from "axios";

const PDFUploadModal = ({ isOpen, onClose, onUpload, event, handleFileDownload, handleDeleteFile }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).filter(
      (file) => file.type === "application/pdf"
    );

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleUpload = () => {
    if (onUpload && files.length > 0) {
      onUpload(files);
      setFiles([]);
      onClose();
    }
  };

  const getCleanFileName = (fileName) => {
    // Check if the file name contains an underscore
    if (fileName.includes('_')) {
      return fileName.split('_').slice(1).join('_'); // Remove the first part if it has an underscore
    }
    return fileName; // Return as is if no underscore
  };

  if (!isOpen) return null;

  return (
    <div className="backdrop-blur-sm bg-[#0000002d] fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#D9D9D9] rounded-lg shadow-xl w-full max-w-[600px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-[1.5rem] text-black font-semibold">
            Upload Event Requirements
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#ff3232]"
          >
            <X size={20} />
          </button>
        </div>
        <Alert
          variant="filled"
          severity="info"
          sx={{
            backgroundColor: "#b5b5b5",
            padding: "0.2rem 0.5rem",
            marginBottom: "2rem",
            color: "#00364c",
            boxShadow:
              "0 4px 8px rgba(190, 190, 190, 0.3), 0 6px 20px rgba(190, 190, 190, 0.15)",
          }}
        >
          Note: Upload all your requirements here in PDF Format only.
        </Alert>

        <div className="mt-4">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload-input"
          />
          <label
            htmlFor="pdf-upload-input"
            className="flex items-center justify-center w-full mb-4 p-10 border-2 border-dashed border-black rounded-lg cursor-pointer hover:border-gray-500 transition"
          >
            <Upload className="mr-3 text-gray-700" />
            <span className="text-gray-700">Click to select PDF files</span>
          </label>

          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  fontWeight: "bold",
                }}
              >
                See Requirements
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  marginLeft: "20px",
                }}
              >
                {event.eventType === "Curriculum" ? (
                  <>
                    <p>1. Intent Letter.pdf</p>
                    <p>2. Fees and funds.pdf <i>(if money is involved)</i></p>
                    <p>3. Voluntary Contribution Letter.pdf <i>(if money is involved)</i></p>
                    <p>4. Letter of UFMO.pdf <i>(if there's a venue)</i></p>
                    <p>5. Learning Journal.pdf</p>
                    <p>6. Activities.pdf</p>
                  </>
                ) : event.eventType === "Organizational" || event.eventType === "College" && (
                  <>
                    <p>1. Intent Letter.pdf</p>
                    <p>2. Fees and Funds.pdf</p>
                    <p>3. Budget Request.pdf</p>
                    <p>4. Voluntary Contribution Letter.pdf</p>
                    <p>5. Parent's Consent.pdf <i>(if it is overnight)</i></p>
                    <p>6. Medical Clearance.pdf <i>(if it is overnight)</i></p>
                    <p>7. Assurance Letter.pdf <i>(if it is overnight)</i></p>
                    <p>8. Certificate of insurance.pdf <i>(if it is overnight)</i></p>
                    <p>9. Learning Journal.pdf</p>
                    <p>10. Activities.pdf</p>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          </div>
          
          {/* REQUIREMENTS UPLOADED */}
          {event.requirementFilesCount > 0 && (
            <div className="mt-1">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  My Uploaded Requirements
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    marginLeft: "20px",
                  }}
                >
                {event.requirementFiles.map((fileName, index) => {
                  const cleanFileName = getCleanFileName(fileName);
                  return (
                    <div key={index} className="flex items-center justify-between space-x-2 mb-2">
                      <div className="flex items-center space-x-2 flex-grow">
                        <AttachFileIcon className="text-gray-500" fontSize="small" />
                        <Typography variant="body2" className="truncate flex-grow border-b-2 border-slate-400">
                          {cleanFileName}
                        </Typography>
                      </div>
                      <div className="flex space-x-1">
                        <IconButton size="small" onClick={() => handleFileDownload(event.eventType, fileName)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteFile(event.id, event.eventType, fileName)}>
                          <DeleteIcon fontSize="small" className="text-red-500" />
                        </IconButton>
                      </div>
                    </div>
                  );
                })}
                </AccordionDetails>
              </Accordion>
            </div>
          )}
          
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm text-gray-700 font-medium mb-2">
                Selected Files:
              </h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-[#BEBEBE] rounded"
                  >
                    <div className="flex items-center">
                      <FileText className="mr-2 text-gray-700" size={20} />
                      <span className="text-sm font-bold text-gray-700">
                        {file.name}
                      </span>
                    </div>
                    <button
                      className="text-gray-700 hover:text-red-600 transition"
                      onClick={() => removeFile(file)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-4 py-2 border bg-[#B7B7B7] text-black rounded hover:bg-[#a2a2a2] transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded transition ${
                files.length === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#313131] text-white hover:bg-[#4a4a4a]"
              }`}
              onClick={handleUpload}
              disabled={files.length === 0}
            >
              Upload Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUploadModal;