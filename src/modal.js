// Post pop-up, rendered with Fancybox (no Bootstrap/jQuery dependency).
// Fancybox opens content in a native <dialog>, which provides the focus trap,
// Escape-to-close and backdrop handling; `triggerEl` returns focus on close.
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {
  formatDate,
  processText,
  getPostImageUrl,
  escapeHtml,
} from "./utils.js";

let modalCount = 0;

function buildModalContent(post) {
  const formattedDate = formatDate(post.created_time);
  const imageUrl = getPostImageUrl(post);

  const permalink = post.permalink_url || "";
  const fullMessage = post.message || "No message available";

  const id = `fbPostModal${++modalCount}`;
  const content = document.createElement("div");
  content.className = imageUrl ? "fb-modal" : "fb-modal fb-modal--no-image";
  content.setAttribute("role", "document");

  content.innerHTML = `
    <button type="button" class="fb-modal__close" data-fancybox-close aria-label="Close">&times;</button>
    ${
      imageUrl
        ? `<div class="fb-modal__image" style="background-image: url('${escapeHtml(imageUrl)}')">
            <img src="${escapeHtml(imageUrl)}" alt="" onerror="this.src='https://placehold.co/600x400/transparent/777?text=Image+not+available'">
          </div>`
        : ""
    }
    <div class="fb-modal__scroll">
      <div class="fb-modal__header">
        <div class="fb-modal__date" id="${id}-date">${formattedDate}</div>
      </div>
      <div class="fb-modal__body" id="${id}-body"></div>
    </div>
    ${
      permalink
        ? `<div class="fb-modal__footer">
            <a href="${escapeHtml(permalink)}" target="_blank" rel="noopener noreferrer" class="fb-modal__button">
              <i class="fab fa-facebook-f" aria-hidden="true"></i>
              View on Facebook
            </a>
          </div>`
        : ""
    }
  `;

  // Insert processed message with HTML (links, line breaks)
  content.querySelector(".fb-modal__body").innerHTML = processText(fullMessage);

  return { content, id };
}

// Show the full post in a pop-up
export function showPostModal(post, triggeringElement = null) {
  const { content, id } = buildModalContent(post);

  Fancybox.show([{ html: content }], {
    mainClass: "fb-fancybox",
    closeButton: false,
    dragToClose: false,
    closeExisting: true,
    placeFocusBack: true,
    triggerEl: triggeringElement || document.activeElement || undefined,
    Carousel: {
      Toolbar: false,
      // No drag/swipe on the single slide: keeps the normal cursor and lets
      // people select text.
      gestures: false,
    },
    on: {
      ready: (instance) => {
        const dialog = instance.getContainer()?.closest("dialog");
        if (dialog) {
          dialog.setAttribute("aria-labelledby", `${id}-date`);
          dialog.setAttribute("aria-describedby", `${id}-body`);
        }
        content.querySelector(".fb-modal__close")?.focus();
      },
    },
  });
}
