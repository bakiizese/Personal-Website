/** Escapes HTML, then turns *word* into <em>word</em>, for display headlines written in site.ts. */
export function emphasis(text: string): string {
  const escaped = text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  return escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
