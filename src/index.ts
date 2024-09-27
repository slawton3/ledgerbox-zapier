import {
  Bundle,
  HttpRequestOptions,
  version as platformVersion,
  ZObject,
} from "zapier-platform-core";
import { getJobResultsCreate } from "./creates/get-job-results";
import { uploadFileCreate } from "./creates/upload";

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
      helpText:
        "Your LedgerBox API Key. You can find this in your LedgerBox account settings [https://ledgerbox.io/dashboard/settings](https://ledgerbox.io/dashboard/settings)",
    },
  ],
  connectionLabel: "{{bundle.inputData.model}}",
};

const addApiKeyHeader = (
  req: HttpRequestOptions,
  z: ZObject,
  bundle: Bundle
) => {
  req.headers = req.headers || {};
  req.headers["X-Api-Key"] = bundle.authData.apiKey;
  return req;
};

const App = {
  version,
  platformVersion,
  authentication,

  beforeRequest: [addApiKeyHeader],

  triggers: {},
  searches: {},
  creates: {
    [uploadFileCreate.key]: uploadFileCreate,
    [getJobResultsCreate.key]: getJobResultsCreate,
  },
  resources: {},
};

export default App;
