import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'

const agent = new BrowserAgent({
  init: {
    session_replay: {
      enabled: true,
      block_selector: '',
      mask_text_selector: '*',
      sampling_rate: 10.0,
      error_sampling_rate: 100.0,
      mask_all_inputs: true,
      collect_fonts: true,
      inline_images: false,
      inline_stylesheet: true,
      fix_stylesheets: true,
      preload: false,
      mask_input_options: {},
    },
    distributed_tracing: {
      enabled: true,
      cors_use_newrelic_header: true,
      cors_use_tracecontext_headers: true,
      // Allow DT headers to be injected into cross-origin requests to the backend
      allowed_origins: [import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000'],
    },
    performance: { capture_measures: true },
    browser_consent_mode: { enabled: false },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ['bam.eu01.nr-data.net'], capture_payloads: 'none' },
  },
  info: {
    beacon: 'bam.eu01.nr-data.net',
    errorBeacon: 'bam.eu01.nr-data.net',
    licenseKey: import.meta.env.VITE_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_NEW_RELIC_APPLICATION_ID,
    sa: 1,
  },
  loader_config: {
    accountID: import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID,
    trustKey: import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID,
    agentID: import.meta.env.VITE_NEW_RELIC_AGENT_ID,
    licenseKey: import.meta.env.VITE_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_NEW_RELIC_APPLICATION_ID,
  },
})

agent.setCustomAttribute('environment', import.meta.env.VITE_APP_ENV ?? 'dev')
