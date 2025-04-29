import Typesense from "typesense";

// Initialize the Typesense client for server-side operations
const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: "search.superwebpros.com",
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: import.meta.env.TYPESENSE_API_KEY || "xyz", // Server-side API key
  connectionTimeoutSeconds: 5,
});

// Function to get all cardinals from Typesense
export async function getAllCardinals() {
  try {
    const response = await typesenseClient
      .collections("jf_cardinals")
      .documents()
      .search({
        q: "*",
        per_page: 300, // Adjust based on your total number of cardinals
      });

    return response.hits.map((hit) => hit.document);
  } catch (error) {
    console.error("Error fetching cardinals from Typesense:", error);
    return [];
  }
}

// Function to get a cardinal by ID
export async function getCardinalById(id) {
  try {
    // First try to retrieve by document ID
    try {
      const document = await typesenseClient
        .collections("jf_cardinals")
        .documents(id)
        .retrieve();
      if (document) return document;
    } catch (err) {
      console.log(
        `Could not find document directly with ID ${id}, trying search...`,
      );
    }

    // If direct lookup fails, try searching by ID or baserow_id
    const searchResponse = await typesenseClient
      .collections("jf_cardinals")
      .documents()
      .search({
        q: "*",
        filter_by: `id:${id} OR baserow_id:${id}`,
        per_page: 1,
      });

    if (searchResponse.hits.length > 0) {
      return searchResponse.hits[0].document;
    }

    // If all else fails, try a broader search
    const fallbackResponse = await typesenseClient
      .collections("jf_cardinals")
      .documents()
      .search({
        q: id,
        query_by: "id,baserow_id,name",
        per_page: 1,
      });

    if (fallbackResponse.hits.length > 0) {
      return fallbackResponse.hits[0].document;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching cardinal with ID ${id}:`, error);
    return null;
  }
}
