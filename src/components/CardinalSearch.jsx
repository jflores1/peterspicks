import { useEffect } from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import instantsearch from "instantsearch.js";
import {
  searchBox,
  refinementList,
  pagination,
  hits,
  stats,
  rangeSlider,
  clearRefinements,
} from "instantsearch.js/es/widgets";

// Define helper function at file scope, outside the component
function getCardinalTypeColor(cardinalType) {
  const colors = {
    "Cardinal Bishop": "#8c1a1a",
    "Cardinal Priest": "#cc0000",
    "Cardinal Deacon": "#e55050",
    default: "#cc0000",
  };
  return colors[cardinalType] || colors.default;
}

export default function CardinalSearch() {
  useEffect(() => {
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

    const searchClient = typesenseInstantsearchAdapter.searchClient;

    // Initialize InstantSearch
    const search = instantsearch({
      indexName: "jf_cardinals",
      searchClient,
      routing: true,
    });

    // Add widgets
    search.addWidgets([
      searchBox({
        container: "#searchbox",
        placeholder: "Search for cardinals by name, country, or title...",
        showReset: true,
        showSubmit: false,
        showLoadingIndicator: true,
      }),

      stats({
        container: "#stats",
        templates: {
          text: ({ nbHits, processingTimeMS }) =>
            `<span>${nbHits} cardinals found in ${processingTimeMS}ms</span>`,
        },
      }),

      hits({
        container: "#hits",
        templates: {
          item: (hit, { html, components }) => html`
            <article class="cardinal-card">
              <div
                class="card-header"
                style="background-color: ${getCardinalTypeColor(
                  hit.cardinalType,
                )}"
              >
                <h3 class="cardinal-name">
                  ${components.Highlight({ hit, attribute: "name" })}
                </h3>
                <p class="cardinal-title">${hit.title || ""}</p>
              </div>
              <div class="card-content">
                <div class="card-image">
                  <img
                    src="${hit.imageUrl || "/images/cardinals/placeholder.jpg"}"
                    alt="${hit.name}"
                  />
                </div>
                <div class="cardinal-details">
                  <p><strong>Age:</strong> ${hit.age} years</p>
                  <p><strong>Country:</strong> ${hit.country}</p>
                  <p><strong>Appointed:</strong> ${hit.yearAppointed}</p>
                  <p>
                    <strong>Papabile Rating:</strong>
                    <span class="papabile-value"
                      >${hit.papabileRating || 5}/10</span
                    >
                  </p>
                </div>
              </div>
              <div class="card-footer">
                <a
                  href="/cardinals/${hit.id || hit.baserow_id}"
                  class="view-button"
                  >View Profile</a
                >
              </div>
            </article>
          `,
          empty: (results) => `
            <div class="no-results">
              <p>No cardinals found for <strong>"${results.query}"</strong></p>
              <p>Try adjusting your search or filters.</p>
            </div>
          `,
        },
      }),

      refinementList({
        container: "#region-list",
        attribute: "region",
        searchable: true,
        searchablePlaceholder: "Search regions",
        showMore: true,
        sortBy: ["name:asc"],
        templates: {
          header: () => "<h3>Region</h3>",
        },
      }),

      refinementList({
        container: "#country-list",
        attribute: "country",
        searchable: true,
        searchablePlaceholder: "Search countries",
        showMore: true,
        sortBy: ["name:asc"],
        templates: {
          header: () => "<h3>Country</h3>",
        },
      }),

      refinementList({
        container: "#cardinal-type-list",
        attribute: "cardinalType",
        templates: {
          header: () => "<h3>Cardinal Type</h3>",
        },
      }),

      refinementList({
        container: "#appointed-by-list",
        attribute: "appointedBy",
        templates: {
          header: () => "<h3>Appointed By</h3>",
        },
      }),

      rangeSlider({
        container: "#papabile-rating",
        attribute: "papabileRating",
        min: 1,
        max: 10,
        precision: 1,
        templates: {
          header: () => "<h3>Papabile Rating</h3>",
        },
      }),

      rangeSlider({
        container: "#age-range",
        attribute: "age",
        templates: {
          header: () => "<h3>Age</h3>",
        },
      }),

      clearRefinements({
        container: "#clear-refinements",
        templates: {
          resetLabel: () => "Clear all filters",
        },
      }),

      pagination({
        container: "#pagination",
        padding: 2,
      }),
    ]);

    // Start the search
    search.start();

    // Cleanup on component unmount
    return () => {
      search.dispose();
    };
  }, []);

  return (
    <div className="search-container">
      <div className="search-panel">
        <div className="search-panel__filters">
          <h2>Filter Cardinals</h2>
          <div id="region-list"></div>
          <div id="country-list"></div>
          <div id="cardinal-type-list"></div>
          <div id="appointed-by-list"></div>
          <div id="papabile-rating"></div>
          <div id="age-range"></div>
          <div id="clear-refinements"></div>
        </div>

        <div className="search-panel__results">
          <div id="searchbox" className="searchbox"></div>
          <div id="stats"></div>
          <div id="hits"></div>
          <div id="pagination"></div>
        </div>
      </div>
    </div>
  );
}
