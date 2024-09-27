"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zapier_platform_core_1 = require("zapier-platform-core");
const get_job_results_1 = require("./creates/get-job-results");
const upload_1 = require("./creates/upload");
const { version } = require("../package.json");
const authentication = {
    type: "custom",
    test: {
        url: "https://ledgerbox.io/api/protected/auth",
        method: "GET",
    },
    fields: [
        {
            key: "apiKey",
            type: "string",
            required: true,
            helpText: "Your LedgerBox API Key. You can find this in your LedgerBox account settings [https://ledgerbox.io/dashboard/settings](https://ledgerbox.io/dashboard/settings)",
        },
    ],
    connectionLabel: "{{bundle.inputData.model}}",
};
const addApiKeyHeader = (req, z, bundle) => {
    req.headers = req.headers || {};
    req.headers["X-Api-Key"] = bundle.authData.apiKey;
    return req;
};
const App = {
    version,
    platformVersion: zapier_platform_core_1.version,
    authentication,
    beforeRequest: [addApiKeyHeader],
    triggers: {},
    searches: {},
    creates: {
        [upload_1.uploadFileCreate.key]: upload_1.uploadFileCreate,
        [get_job_results_1.getJobResultsCreate.key]: get_job_results_1.getJobResultsCreate,
    },
    resources: {},
};
exports.default = App;
