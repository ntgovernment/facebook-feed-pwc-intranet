// Utility functions

// Helper: Format date as DD MMM YYYY
export function formatDate(dateString) {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Helper: Convert URLs in text to clickable links
export function linkifyText(text) {
  if (!text) return "";

  // URL pattern that matches http, https, and www URLs
  const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;

  return text.replace(urlPattern, (url) => {
    // Add protocol if missing (for www. links)
    const href = url.startsWith("www.") ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="fb-text-link">${url}</a>`;
  });
}

// Helper: Escape HTML to prevent XSS
export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Helper: Remove all emojis and special characters
export function removeEmojis(text) {
  if (!text) return "";
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}]/gu, // Emoticons
      "",
    )
    .replace(
      /[\u{1F300}-\u{1F5FF}]/gu, // Misc Symbols and Pictographs
      "",
    )
    .replace(
      /[\u{1F680}-\u{1F6FF}]/gu, // Transport and Map
      "",
    )
    .replace(
      /[\u{1F1E0}-\u{1F1FF}]/gu, // Flags
      "",
    )
    .replace(
      /[\u{2600}-\u{26FF}]/gu, // Misc symbols
      "",
    )
    .replace(
      /[\u{2700}-\u{27BF}]/gu, // Dingbats
      "",
    )
    .replace(
      /[\u{1F900}-\u{1F9FF}]/gu, // Supplemental Symbols and Pictographs
      "",
    )
    .replace(
      /[\u{1FA00}-\u{1FA6F}]/gu, // Chess Symbols
      "",
    )
    .replace(
      /[\u{1FA70}-\u{1FAFF}]/gu, // Symbols and Pictographs Extended-A
      "",
    )
    .replace(
      /[\u{2300}-\u{23FF}]/gu, // Miscellaneous Technical (includes ⏰)
      "",
    )
    .replace(
      /[\u{2B00}-\u{2BFF}]/gu, // Miscellaneous Symbols and Arrows (includes ⭐)
      "",
    )
    .replace(
      /[\u{FE00}-\u{FE0F}]/gu, // Variation Selectors
      "",
    )
    .replace(
      /[\u{200D}]/gu, // Zero Width Joiner
      "",
    )
    .replace(
      /[\u{20E3}]/gu, // Combining Enclosing Keycap
      "",
    )
    .replace(
      /[\u{E0020}-\u{E007F}]/gu, // Tags
      "",
    )
    .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs (not newlines) with single space
    .trim();
}

// Helper: Process text with line breaks and links
export function processText(text) {
  if (!text) return "";

  // First, split text into parts (URLs and non-URLs)
  const urlPattern = /(https?:\/\/[^\s<>]+)|(www\.[^\s<>]+)/gi;
  let lastIndex = 0;
  let result = "";
  let match;

  // Reset regex
  const regex = new RegExp(urlPattern);

  while ((match = regex.exec(text)) !== null) {
    // Add the text before the URL (escaped)
    const beforeUrl = text.substring(lastIndex, match.index);
    result += escapeHtml(beforeUrl).replace(/\n/g, "<br>");

    // Add the URL as a link
    const url = match[0];
    const href = url.startsWith("www.") ? `https://${url}` : url;
    result += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="fb-text-link">${escapeHtml(url)}</a>`;

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last URL
  let remainingText = escapeHtml(text.substring(lastIndex));

  // Convert @mentions to Facebook profile links
  remainingText = remainingText.replace(
    /@([a-zA-Z0-9.]{1,50})\b/g,
    '<a href="https://facebook.com/$1" target="_blank" rel="noopener noreferrer" class="fb-text-link">@$1</a>',
  );

  // Convert #hashtags to Facebook hashtag search links
  // Negative lookbehind (?<!&) prevents matching HTML entities like &#039;
  // Hashtags can start with a letter or number (e.g., #16days)
  // Semi-colons are excluded as they're not in the allowed character class
  remainingText = remainingText.replace(
    /(?<!&)#([a-zA-Z0-9][a-zA-Z0-9_]*)\b/g,
    '<a href="https://facebook.com/hashtag/$1" target="_blank" rel="noopener noreferrer" class="fb-text-link">#$1</a>',
  );

  result += remainingText.replace(/\n/g, "<br>");

  return result;
}

// Helper: Determine if post has photo/album attachment
export function hasPhotoAttachment(post) {
  // Always return true to show all posts with photo card layout
  // Posts without images will use the placeholder
  return true;
}

// Helper: Get the post's own image URL, or null if it has none
export function getPostImageUrl(post) {
  return (
    post.full_picture || post.attachments?.data?.[0]?.media?.image?.src || null
  );
}

// Helper: Get image URL from post
export function getImageUrl(post) {
  // Check for full_picture field (from Facebook Graph API)
  if (post.full_picture) {
    return post.full_picture;
  }

  // Get image from media field in attachments
  if (post.attachments?.data?.[0]?.media?.image?.src) {
    return post.attachments.data[0].media.image.src;
  }

  // Fallback to local placeholder image
  return "./placeholder.png";
}

// Split a post message into the card heading (full first line) and
// supporting text (second line, if any). Blank lines are skipped.
export function extractContent(message) {
  const lines = (message || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => removeEmojis(line))
    .filter(Boolean);

  return {
    title: lines[0] || "View post",
    description: lines[1] || "",
  };
}

// Filter posts based on widget configuration
export function filterPosts(posts, startDate, endDate, keywords) {
  let filtered = [...posts];

  // Filter by date range
  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter((post) => new Date(post.created_time) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    filtered = filtered.filter((post) => new Date(post.created_time) <= end);
  }

  // Filter by keywords
  if (keywords) {
    const keywordArray = keywords
      .toLowerCase()
      .split(",")
      .map((k) => k.trim());
    filtered = filtered.filter((post) => {
      const message = (post.message || "").toLowerCase();
      return keywordArray.some((keyword) => message.includes(keyword));
    });
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

  return filtered;
}
