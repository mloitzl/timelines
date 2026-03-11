import LogRocket from 'logrocket'

const appId = import.meta.env.VITE_LOGROCKET_APP_ID

if (appId) {
  LogRocket.init(appId, {
    dom: {
      // Ensures rrweb resolves relative CSS file paths (/assets/*.css) correctly
      // during DOM snapshot serialization. Without this, production builds lose
      // all styling in session replays because Vite extracts CSS into separate files.
      baseHref: window.location.origin,
    },
  })
  LogRocket.identify(undefined, {
    environment: import.meta.env.VITE_APP_ENV ?? 'dev',
  })
}
