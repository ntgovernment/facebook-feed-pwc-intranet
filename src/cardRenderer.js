// Card rendering functions
import {
  formatDate,
  extractContent,
  getImageUrl,
  escapeHtml,
} from "./utils.js";
import { showPostModal } from "./modal.js";

// Build a news-style card: optional image on the left, then the heading
// (first line of the post), supporting text (second line, clamped to two
// lines by CSS), and the date. Clicking anywhere on the card opens the post.
function createCard(post, { withImage }) {
  const { title, description } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);

  const card = document.createElement("article");
  card.className = withImage ? "fb-card" : "fb-card fb-card--text";

  const imageMarkup = withImage
    ? `
    <div class="fb-card__image" style="background-image: url('${escapeHtml(getImageUrl(post))}')">
      <img src="${escapeHtml(getImageUrl(post))}" alt="" onerror="this.src='https://placehold.co/353x199/transparent/777?text=Image+not+available'">
    </div>`
    : "";

  card.innerHTML = `${imageMarkup}
    <div class="fb-card__body">
      <div class="fb-card__text">
        <h3 class="fb-card__title">
          <a href="#" class="fb-card__title-link" aria-haspopup="dialog">${escapeHtml(title)}</a>
        </h3>
        ${description ? `<p class="fb-card__description">${escapeHtml(description)}</p>` : ""}
      </div>
      <div class="fb-card__footer">
        <time class="fb-card__date" datetime="${escapeHtml(post.created_time || "")}">${formattedDate}</time>
      </div>
    </div>
  `;

  const titleLink = card.querySelector(".fb-card__title-link");

  // The title link is the keyboard/screen-reader target; the whole card is a
  // larger mouse target that does the same thing.
  card.addEventListener("click", (e) => {
    e.preventDefault();
    showPostModal(post, titleLink);
  });

  return card;
}

// Create photo card layout
export function createPhotoCard(post) {
  return createCard(post, { withImage: true });
}

// Create text-only card layout
export function createTextCard(post) {
  return createCard(post, { withImage: false });
}
