// index.js
const FormData = require('form-data');
const stream = require('stream');

const authentication = {
  type: 'custom',
  test: {
    url: 'https://ledgerbox.io/api/protected/job',
  },
  fields: [
    {
      key: 'apiKey',
      type: 'string',
      required: true,
      helpText: 'Your LedgerBox API Key. You can find this in your LedgerBox account settings at https://ledgerbox.io/account/api-keys.'
    }
  ],
  connectionLabel: '{{bundle.authData.apiKey}}'
};

const performUpload = async (z, bundle) => {
  const formData = new FormData();
  
  if (bundle.inputData.file) {
    const fileStream = new stream.Readable();
    fileStream.push(bundle.inputData.file.content);
    fileStream.push(null);

    formData.append('files', fileStream, {
      filename: bundle.inputData.file.filename || 'file',
      contentType: bundle.inputData.file.contentType,
    });
  }

  const response = await z.request({
    url: `https://ledgerbox.io/api/protected/upload?model=${bundle.inputData.model}`,
    method: 'POST',
    body: formData,
    headers: {
      ...formData.getHeaders(),
      'Accept': 'application/json',
      'X-API-Key': bundle.authData.apiKey
    },
  });

  return response.data;
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
        description: 'Uploads one or more files to LedgerBox.'
      },
      operation: {
        inputFields: [
          {key: 'file', required: true, label: 'File', type: 'file'},
          {key: 'model', required: true, label: 'Model', type: 'string', helpText: 'The model to use for the upload. This is usually the name of the company or organization that will be processing the files.'}
        ],
        perform: performUpload,
        sample: {
          id: 1,
          filename: 'example.pdf',
          url: 'https://ledgerbox.io/files/example.pdf',
          model: 'invoice'
        }
      }
    }
  },
};

module.exports = App;