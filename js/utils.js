/**
 * utils.js — Shared Utilities
 */

/**
 * HTML 특수문자를 이스케이프해 XSS를 방지합니다.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return str
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Date 객체를 'YYYY-MM-DD' 문자열로 변환합니다.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
}

function getRoomImageSource(picture) {
  if (!picture) {
    return 'https://via.placeholder.com/1200x800?text=Room';
  }

  const trimmedPicture = picture.trim();

  if (
    trimmedPicture.startsWith('data:') ||
    trimmedPicture.startsWith('http://') ||
    trimmedPicture.startsWith('https://')
  ) {
    return trimmedPicture;
  }

  if (trimmedPicture.startsWith('/')) {
    if (trimmedPicture.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${trimmedPicture}`;
    }

    return trimmedPicture;
  }

  if (trimmedPicture.startsWith('iVBOR')) {
    return `data:image/png;base64,${trimmedPicture}`;
  }

  if (trimmedPicture.startsWith('R0lGOD')) {
    return `data:image/gif;base64,${trimmedPicture}`;
  }

  if (trimmedPicture.startsWith('UklGR')) {
    return `data:image/webp;base64,${trimmedPicture}`;
  }

  return `data:image/jpeg;base64,${trimmedPicture}`;
}
