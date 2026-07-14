'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

/**
 * Fires a custom dataLayer event when this page mounts. Needed because this
 * page is reached via client-side `router.push()` after the inscription
 * form submits, so the container never reloads and tags bound to GTM's
 * built-in "Page View" trigger type (which only fires on the container's
 * real, one-time boot) never re-fire. GTM's native Page View trigger can't
 * be replayed from outside — a Custom Event trigger is required instead.
 */
export function GtmPageviewReload() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'obrigado_pageview',
    })
  }, [])

  return null
}
