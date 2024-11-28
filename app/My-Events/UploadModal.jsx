import React, { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import Alert from "@mui/material/Alert";
// import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

const PDFUploadModal = ({ isOpen, onClose, onUpload }) => {
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

            // border: "1px solid #5e757e",
          }}
        >
          Note: Upload all your requirements here in PDF Format only.
        </Alert>

        {/* <p className="text-sm text-gray-600 mb-4">
          Upload multiple PDF files for your event. Maximum 5 files allowed.
        </p> */}

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
                <p>1. Intent Letter.pdf</p>
                <p>2. Budget Request.pdf</p>
                <p>3. Excuse Letter.pdf</p>
                <p>4. Disbursement.pdf</p>
                <p>5. Permit to Borrow.pdf</p>
                <p>6. Permit to Transfer.pdf</p>
              </AccordionDetails>
            </Accordion>
          </div>

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
