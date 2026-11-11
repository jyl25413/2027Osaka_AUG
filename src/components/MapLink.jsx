export default function MapLink({ query, children, className = '' }) {
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  const linkCls = `inline-flex items-center gap-1 text-brand-600 underline decoration-brand-300 underline-offset-2 active:text-brand-700 ${className}`
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={linkCls}
        title="Google Maps"
      >
        {children}
        <span aria-hidden="true">📍</span>
      </a>
    </span>
  )
}
