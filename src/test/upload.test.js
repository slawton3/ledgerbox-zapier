// test/example.test.js
const zapier = require('zapier-platform-core');
const App = require('../../index');
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

    it('should upload a base64-encoded file', async () => {
      const filePath = path.join(__dirname, 'test.pdf');
      const fileContent = fs.readFileSync(filePath, {encoding: 'base64'});
    
      const bundle = {
        authData: {
          apiKey: process.env.API_KEY,
        },
        inputData: {
          fileContent: fileContent,
          filename: 'test.pdf',
          contentType: 'application/pdf',
          model: 'invoice',
        },
      };
    
      const results = await appTester(App.creates.upload_file.operation.perform, bundle);
      expect(results.id).toBeDefined();
      expect(results.jobStatus).toBe('processing');
      expect(results.documentIds).toBeDefined();
      expect(Array.isArray(results.documentIds)).toBe(true);
    });

    const results = await appTester(App.creates.upload_file.operation.perform, bundle);
    console.log(results);

    expect(results.message).toBe('Files uploaded successfully');
    expect(results.results.jobId).toBeDefined();
    expect(results.results.jobStatus).toBeDefined();
    expect(results.results.documentIds).toBeDefined();
  });
});