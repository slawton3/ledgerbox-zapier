import { Bundle, ZObject } from "zapier-platform-core";
import { z as zod } from "zod";
import { BankStatementSchema, InvoiceSchema, ReceiptSchema } from "../schemas";

type ModelType = "invoice" | "receipt" | "bankstatement";

const getJobResults = async (z: ZObject, bundle: Bundle) => {
  const response = await z.request({
    url: "https://ledgerbox.io/api/protected/export",
    params: {
      jobId: bundle.inputData.jobId,
    },
  });

  if (response.status !== 200) {
    throw new Error(
      `Failed to get job results: ${response.status} ${response.content}`
    );
  }

  return response.json;
};

const validateAndProcessResults = (results: any, model: ModelType) => {
  let schema: zod.ZodType;
  switch (model) {
    case "invoice":
      schema = InvoiceSchema;
      break;
    case "receipt":
      schema = ReceiptSchema;
      break;
    case "bankstatement":
      schema = BankStatementSchema;
      break;
    default:
      throw new Error(`Invalid model: ${model}`);
  }

  const validatedResults = schema.parse(results);
  return {
    id: results.jobId,
    status: results.status,
    jobId: results.jobId,
    model: model,
    ...validatedResults,
  };
};

const performGetJobResults = async (z: ZObject, bundle: Bundle) => {
  const jobResults = await getJobResults(z, bundle);

  if (!jobResults || typeof jobResults !== "object") {
    throw new Error(`Unexpected job results format: ${typeof jobResults}`);
  }

  return validateAndProcessResults(
    jobResults,
    bundle.inputData.model as ModelType
  );
};

const getDynamicFields = (z: ZObject, bundle: Bundle) => {
  const model = bundle.inputData.model as ModelType;
  let schema: zod.ZodType;

  switch (model) {
    case "invoice":
      schema = InvoiceSchema;
      break;
    case "receipt":
      schema = ReceiptSchema;
      break;
    case "bankstatement":
      schema = BankStatementSchema;
      break;
    default:
      return [];
  }

  if (schema instanceof zod.ZodObject) {
    return Object.entries(schema.shape).map(([key, value]) => ({
      key,
      label: key,
      type: value instanceof zod.ZodNumber ? "number" : "string",
    }));
  } else {
    z.console.log(
      "Schema is not a ZodObject, unable to generate dynamic fields"
    );
    return [];
  }
};

const getModelSample = (model: ModelType) => {
  switch (model) {
    case "invoice":
      return {
        id: "job-12345",
        status: "success",
        jobId: "job-12345",
        model: "invoice",
        CustomerName: "ACME Corporation",
        InvoiceId: "INV-001",
        InvoiceDate: "2023-06-01",
        DueDate: "2023-07-01",
        VendorName: "Supplier Inc.",
        InvoiceTotal: 1100.0,
        LineItems: [
          {
            Items: "Product A",
            Amount: 500.0,
            Quantity: 5,
            UnitPrice: 100.0,
          },
        ],
      };
    case "receipt":
      return {
        id: "job-12346",
        status: "success",
        jobId: "job-12346",
        model: "receipt",
        MerchantName: "Local Store",
        Total: 50.0,
        TransactionDate: "2023-06-02",
        Items: [
          {
            Description: "Item A",
            Quantity: 2,
            Price: 25.0,
          },
        ],
      };
    case "bankstatement":
      return {
        id: "job-12347",
        status: "success",
        jobId: "job-12347",
        model: "bankstatement",
        AccountNumber: "1234567890",
        BankName: "Example Bank",
        PeriodStartDate: "2023-05-01",
        PeriodEndDate: "2023-05-31",
        StartingBalance: "1000.00",
        EndingBalance: "1500.00",
        LineItems: [
          {
            Date: "2023-05-15",
            Description: "Deposit",
            Credits: "500.00",
            Debits: "",
            Balance: "1500.00",
          },
        ],
      };
  }
};

const getJobResultsCreate = {
  key: "get_job_results",
  noun: "Job Results",
  display: {
    label: "Get Job Results",
    description: "Retrieves the results of a completed job.",
  },
  operation: {
    inputFields: [
      {
        key: "jobId",
        label: "Job ID",
        type: "string",
        required: true,
        helpText:
          'Enter the Job ID you want to retrieve results for. You can get this from the "Upload File" action.',
      },
      {
        key: "model",
        label: "Processing Model",
        type: "string",
        required: true,
        choices: ["invoice", "receipt", "bankstatement"],
        helpText: "The model used for processing the file.",
        altersDynamicFields: true,
      },
    ],
    perform: performGetJobResults,
    sample: getModelSample("invoice"),
    outputFields: [
      { key: "id", label: "ID", type: "string" },
      { key: "status", label: "Status", type: "string" },
      { key: "jobId", label: "Job ID", type: "string" },
      { key: "model", label: "Model", type: "string" },
      getDynamicFields,
    ],
  },
};

export { getJobResultsCreate };
