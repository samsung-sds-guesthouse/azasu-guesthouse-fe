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
  return str.toString()
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

/**
 * Date 객체를 'YYYY-MM-DD' 문자열로 변환합니다.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return (
    date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0')
  );
}