/** Renders admin-authored rich-text HTML with tasteful prose styling. */
export function RichText({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-admin ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
