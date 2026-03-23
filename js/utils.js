/**
 * Sanitizes a string to prevent XSS attacks by escaping HTML characters.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
function escapeHTML(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Example of how to use it:
 * const userInput = '<img src=x onerror=alert(1)>';
 * const sanitizedInput = escapeHTML(userInput);
 * document.getElementById('someElement').innerHTML = sanitizedInput; // This is now safe
 */
