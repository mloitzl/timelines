import LogRocket from 'logrocket'

const appId = import.meta.env.VITE_LOGROCKET_APP_ID

if (appId) {
  LogRocket.init(appId)
  LogRocket.identify(undefined, {
    environment: import.meta.env.VITE_APP_ENV ?? 'dev',
  })
}
