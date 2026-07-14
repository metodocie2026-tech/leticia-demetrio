'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

/**
 * Re-pushes the same 'gtm.js' bootstrap event GTM's own snippet fires on a
 * real page load. Needed because this page is reached via client-side
 * `router.push()` after the inscription form submits, so the container
 * never reloads and tags bound to the built-in "All Pages" trigger
 * (e.g. the Pixel) never re-fire.
 */
export function GtmPageviewReload() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    })
  }, [])

  return null
}
