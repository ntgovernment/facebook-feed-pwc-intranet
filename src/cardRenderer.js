// Card rendering functions
import {
  formatDate,
  extractContent,
  getImageUrl,
  escapeHtml,
} from "./utils.js";

function openPermalink(permalink) {
  if (!permalink || permalink === "#") return;
  window.open(permalink, "_blank", "noopener,noreferrer");
}

// Create photo card layout
export function createPhotoCard(post) {
  const { title } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const imageUrl = getImageUrl(post);
  const permalink = post.permalink_url || "#";

  // Get engagement stats
  const likes = post.reactions?.summary?.total_count || 0;
  const comments = post.comments?.summary?.total_count || 0;
  const shares = post.shares?.count || 0;

  const card = document.createElement("div");
  card.className = "fb-card";
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open post: ${escapeHtml(title)}`);
  card.innerHTML = `
    <div class="fb-card__inner" data-footer="false" data-header="true" data-rich-media="true">
      <div class="fb-card__image" data-ratio="16:9" style="background-image: url('${imageUrl}')">
        <img src="${imageUrl}" alt="Post image" onerror="this.src='https://placehold.co/353x199/transparent/777?text=Image+not+available'">
      </div>
      <div class="fb-card__header" data-show-date="true" data-show-tag="true">
        <div class="fb-card__engagement">
          <div class="fb-card__stat">
            <i class="fal fa-thumbs-up fb-card__icon fb-card__icon--inactive"></i>
            ${likes > 0 ? `<span class="fb-card__count">${likes}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="fal fa-comment fb-card__icon fb-card__icon--flipped fb-card__icon--inactive"></i>
            ${comments > 0 ? `<span class="fb-card__count">${comments}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="fal fa-share fb-card__icon fb-card__icon--inactive"></i>
            ${shares > 0 ? `<span class="fb-card__count">${shares}</span>` : ""}
          </div>
        </div>
        <div class="fb-card__date">${formattedDate}</div>
      </div>
      <div class="fb-card__content" data-icon="false" data-type="Default">
        <div class="fb-card__text">
          <div class="fb-card__title-row">
            <a href="${escapeHtml(permalink)}" target="_blank" rel="noopener noreferrer" class="fb-card__title fb-card__title--link">${escapeHtml(title)}...</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Card click handler: open permalink when clicking non-link card areas
  card.addEventListener("click", (e) => {
    if (!e.target.closest("a")) {
      openPermalink(permalink);
    }
  });

  // Keyboard handler for accessibility
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPermalink(permalink);
    }
  });

  return card;
}

// Create text-only card layout
export function createTextCard(post) {
  const { title } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const permalink = post.permalink_url || "#";

  // Get engagement stats
  const likes = post.reactions?.summary?.total_count || 0;
  const comments = post.comments?.summary?.total_count || 0;
  const shares = post.shares?.count || 0;

  const card = document.createElement("div");
  card.className = "fb-card";
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open post: ${escapeHtml(title)}`);
  card.innerHTML = `
    <div class="fb-card__inner fb-card__inner--text" data-footer="false" data-header="true" data-rich-media="false">
      <div class="fb-card__header" data-show-date="true" data-show-tag="true">
        <div class="fb-card__engagement">
          <div class="fb-card__stat">
            <i class="fal fa-thumbs-up fb-card__icon fb-card__icon--inactive"></i>
            ${likes > 0 ? `<span class="fb-card__count">${likes}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="fal fa-comment fb-card__icon fb-card__icon--flipped fb-card__icon--inactive"></i>
            ${comments > 0 ? `<span class="fb-card__count">${comments}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="fal fa-share fb-card__icon fb-card__icon--inactive"></i>
            ${shares > 0 ? `<span class="fb-card__count">${shares}</span>` : ""}
          </div>
        </div>
        <div class="fb-card__date">${formattedDate}</div>
      </div>
      <div class="fb-card__content" data-icon="false" data-type="Default">
        <div class="fb-card__text">
          <div class="fb-card__title-row">
            <a href="${escapeHtml(permalink)}" target="_blank" rel="noopener noreferrer" class="fb-card__title fb-card__title--link">${escapeHtml(title)}...</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Card click handler: open permalink when clicking non-link card areas
  card.addEventListener("click", (e) => {
    if (!e.target.closest("a")) {
      openPermalink(permalink);
    }
  });

  // Keyboard handler for accessibility
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPermalink(permalink);
    }
  });

  return card;
}
