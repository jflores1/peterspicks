import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

// Initialize the TypeSense client for client-side search
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: import.meta.env.PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY || "xyz", // Public search-only key
    nodes: [
      {
        host: "search.superwebpros.com",
        port: 443,
        protocol: "https",
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "name,title,country,region,appointedBy,shortBio",
    num_typos: 2,
    per_page: 10,
  },
});

export const searchClient = typesenseInstantsearchAdapter.searchClient;
