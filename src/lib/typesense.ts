import Typesense from "typesense";

// Get API key from environment variables
const typesenseApiKey = import.meta.env.TYPESENSE_API_KEY;

if (!typesenseApiKey) {
  console.error("TYPESENSE_API_KEY is not defined in environment variables");
}

// Initialize the client
const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: "search.superwebpros.com",
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: typesenseApiKey,
  connectionTimeoutSeconds: 2,
});

export default typesenseClient;
