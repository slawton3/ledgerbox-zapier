import FormData from "form-data";
import { Bundle, ZObject } from "zapier-platform-core";

// Perform the upload action
const performUpload = async (z: ZObject, bundle: Bundle) => {
  const formData = new FormData();

  const fileResponse = await z.request({
    url: bundle.inputData.file,
    raw: true,
  });

  const fileContent = await fileResponse.buffer();

  formData.append("files", fileContent, {
    filename: bundle.inputData.filename,
    contentType: bundle.inputData.contentType || "application/octet-stream",
  });

  const response = await z.request({
    url: `https://ledgerbox.io/api/protected/upload`,
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "X-API-Key": bundle.authData.apiKey,
    },
    params: {
      model: bundle.inputData.model,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Upload failed: ${response.status} ${response.content}`);
  }

  return response.json;
};

// Define the upload_file create
const uploadFileCreate = {
  key: "upload_file",
  noun: "File",
  display: {
    label: "Upload File",
    description:
      "Uploads a file to LedgerBox and processes it with the specified model.",
  },
  operation: {
    inputFields: [
      {
        key: "file",
        label: "File",
        type: "file",
        required: true,
        helpText:
          "The file you want to upload and process. Must be a PDF, JPEG, or PNG file under 10MB.",
      },
      {
        key: "filename",
        label: "Filename",
        type: "string",
        required: true,
        helpText:
          "The name of the file, including its extension (e.g., invoice.pdf).",
      },
      {
        key: "contentType",
        label: "Content Type",
        type: "string",
        required: false,
        helpText:
          "The MIME type of the file (e.g., application/pdf). If not provided, application/octet-stream will be used.",
      },
      {
        key: "model",
        label: "Processing Model",
        type: "string",
        required: true,
        choices: ["invoice", "receipt", "bankstatement"],
        helpText: "The model to use for processing the file.",
        altersDynamicFields: true,
      },
    ],
    perform: performUpload,
    sample: {
      message: "Files uploaded successfully",
      results: {
        jobId: "job-12345",
        jobStatus: "Processing",
        documentIds: ["doc-67890"],
      },
    },
    outputFields: [
      { key: "message", label: "Message", type: "string" },
      { key: "results__jobId", label: "Job ID", type: "string" },
      { key: "results__jobStatus", label: "Job Status", type: "string" },
      {
        key: "results__documentIds",
        label: "Document IDs",
        type: "string",
      },
    ],
  },
};

export { uploadFileCreate };
