// Main JavaScript entry point
import "./styles.css";
import facebookData from "./data.json";
import { hasPhotoAttachment, filterPosts } from "./utils.js";
import { createPhotoCard, createTextCard } from "./cardRenderer.js";

console.log("Facebook Feed Agency Internet - Loaded!");

// State management
let filteredPosts = [];

function normalizePostsData(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload?.data && Array.isArray(payload.data)) {
    return payload.data;
  }

  return null;
}

function getLocalFallbackPosts() {
  return Array.isArray(facebookData) ? facebookData : facebookData?.data;
}

function hasRenderableFeedMarkup(widget) {
  return Boolean(
    widget.querySelector(".fb-feed__grid, .fb-card, .fb-feed__empty"),
  );
}

// Fetch posts from API
async function fetchPosts(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts from API:", error);
    return null;
  }
}

// Render cards
function renderCards(container, posts, start, end) {
  const fragment = document.createDocumentFragment();

  for (let i = start; i < end && i < posts.length; i++) {
    const post = posts[i];
    const card = hasPhotoAttachment(post)
      ? createPhotoCard(post)
      : createTextCard(post);
    fragment.appendChild(card);
  }

  container.appendChild(fragment);
}

// Setup feed and render all posts
function setupFeed(widget, posts, cardSize) {
  if (posts.length === 0) {
    widget.innerHTML =
      '<p class="fb-feed__empty">Unable to load Facebook posts right now.</p>';
    return;
  }

  // Create container
  const container = document.createElement("div");
  container.className = `fb-feed__grid fb-feed__grid--${cardSize}`;
  widget.appendChild(container);

  // Render all cards at once
  renderCards(container, posts, 0, posts.length);
}

// Initialize widget
async function initializeWidget() {
  const widget = document.querySelector("[data-securent-fb-widget]");
  if (!widget) return;

  const hasRetainableMarkup = hasRenderableFeedMarkup(widget);

  // Extract configuration
  const apiUrl = widget.dataset.apiUrl || "";
  const fallbackUrl = widget.dataset.fallbackUrl || "";
  const startDate = widget.dataset.startDate || "";
  const endDate = widget.dataset.endDate || "";
  const filterKeywords = widget.dataset.filterKeywords || "";
  const cardSize = widget.dataset.cardSize || "compact";
  const host = window.location.hostname;
  const isLocalhost =
    host === "localhost" || host === "127.0.0.1" || host === "::1";
  const enableMockFallback =
    widget.dataset.enableMockFallback === "true" || isLocalhost;

  let postsData = null;
  let hasUsableFeedData = false;

  // Try to fetch from API if URL is provided (production)
  if (apiUrl) {
    console.log("Fetching posts from API:", apiUrl);
    postsData = normalizePostsData(await fetchPosts(apiUrl));
  }

  // Try fallback URL if primary API failed
  if (!postsData && fallbackUrl) {
    postsData = normalizePostsData(await fetchPosts(fallbackUrl));
  }

  // Use local mock data only for localhost or when explicitly enabled.
  if (!postsData && enableMockFallback) {
    console.warn(
      "Using mock data from data.json (localhost or enableMockFallback=true)",
    );
    postsData = getLocalFallbackPosts();
  }

  // If remote sources are unavailable in production, fall back to the bundled snapshot
  // so the widget still renders something useful instead of showing an error state.
  if (!postsData) {
    const localFallbackPosts = getLocalFallbackPosts();
    if (Array.isArray(localFallbackPosts) && localFallbackPosts.length > 0) {
      console.warn(
        "Using bundled local snapshot because remote feed data was unavailable.",
      );
      postsData = localFallbackPosts;
    }
  }

  if (!postsData && !enableMockFallback) {
    console.error(
      "No usable feed data returned from API/fallback URL; mock fallback disabled.",
    );
  }

  // Ensure postsData is always a valid array
  if (postsData && Array.isArray(postsData)) {
    hasUsableFeedData = true;
  } else {
    console.error("Invalid posts data format:", postsData);
    postsData = [];
  }

  // In production, preserve existing server-rendered cards when runtime fetch fails.
  if (!hasUsableFeedData && hasRetainableMarkup && !enableMockFallback) {
    console.warn(
      "Retaining existing feed markup because runtime API data was unavailable.",
    );
    return;
  }

  // Replace existing markup only when we have valid feed data (or explicit local fallback).
  widget.innerHTML = "";

  // Filter posts
  filteredPosts = filterPosts(postsData, startDate, endDate, filterKeywords);

  // Setup the feed
  setupFeed(widget, filteredPosts, cardSize);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeWidget();
});
