const FormData = require('form-data');

const authentication = {
  type: 'custom',
  test: {
    url: 'https://ledgerbox.io/api/protected/auth',
  },
  fields: [
    {
      key: 'apiKey',
      type: 'string',
      required: true,
      helpText: 'Your LedgerBox API Key. You can find this in your LedgerBox account settings at https://ledgerbox.io/dashboard/settings'
    }
  ],
  connectionLabel: '{{bundle.authData.apiKey}}'
};

const performUpload = async (z, bundle) => {
  const formData = new FormData();
  
  // Fetch the file content from the Zapier-provided URL
  const fileResponse = await z.request({
    url: bundle.inputData.file,
    raw: true,
  });

  // Get the file content as a buffer
  const fileContent = await fileResponse.buffer();

  // Append the file to the form data
  formData.append('files', fileContent, {
    filename: bundle.inputData.filename,
    contentType: bundle.inputData.contentType || 'application/octet-stream'
  });

  const response = await z.request({
    url: `https://ledgerbox.io/api/protected/upload`,
    method: 'POST',
    body: formData,
    headers: {
      ...formData.getHeaders(),
      'Accept': 'application/json',
      'X-API-Key': bundle.authData.apiKey
    },
    params: {
      model: bundle.inputData.model
    }
  });

  // If the response is not ok, throw an error
  if (response.status !== 200) {
    throw new Error(`Unexpected status code ${response.status}: ${response.content}`);
  }

  return response.json;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [
    (request, z, bundle) => {
      request.headers['X-API-Key'] = bundle.authData.apiKey;
      return request;
    }
  ],

  creates: {
    upload_file: {
      key: 'upload_file',
      noun: 'File',
      display: {
        label: 'Upload File',
        description: 'Uploads a file to LedgerBox and processes it with the specified model.'
      },
      operation: {
        inputFields: [
          {
            key: 'file',
            label: 'File',
            type: 'file',
            required: true,
            helpText: 'The file you want to upload and process. Must be a PDF, JPEG, or PNG file under 10MB.'
          },
          {
            key: 'filename',
            label: 'Filename',
            type: 'string',
            required: true,
            helpText: 'The name of the file, including its extension (e.g., invoice.pdf).'
          },
          {
            key: 'contentType',
            label: 'Content Type',
            type: 'string',
            required: false,
            helpText: 'The MIME type of the file (e.g., application/pdf). If not provided, application/octet-stream will be used.'
          },
          {
            key: 'model',
            label: 'Processing Model',
            type: 'string',
            required: true,
            choices: ['invoice', 'receipt', 'bankstatement'],
            helpText: 'The model to use for processing the file.'
          }
        ],
        perform: performUpload,
        sample: {
          message: "Files uploaded successfully",
          results: {
            jobId: "job-12345",
            jobStatus: "Processing",
            documentIds: ["doc-67890"]
          }
        },
        outputFields: [
          {key: 'message', label: 'Message', type: 'string'},
          {key: 'results__jobId', label: 'Job ID', type: 'string'},
          {key: 'results__jobStatus', label: 'Job Status', type: 'string'},
          {key: 'results__documentIds', label: 'Document IDs', type: 'string'}
        ]
      }
    }
  }
};

module.exports = App;