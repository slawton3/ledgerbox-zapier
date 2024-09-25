// test/example.test.js
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const fs = require('fs');
zapier.tools.env.inject();

describe('My App', () => {
  it('should upload a file', async () => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
      },
      inputData: {
        file: {
          filename: 'test.pdf',
          contentType: 'application/pdf',
          // Read the file from the current directory
          content: fs.readFileSync('./test.pdf'),
        },
        model: 'invoice',
      },
    };

    const results = await appTester(App.creates.upload_file.operation.perform, bundle);
    console.log(results);

    expect(results.message).toBe('Files uploaded successfully');
    expect(results.results.jobId).toBeDefined();
    expect(results.results.jobStatus).toBeDefined();
    expect(results.results.documentIds).toBeDefined();
  });
});