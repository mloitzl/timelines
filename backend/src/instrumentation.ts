import { NodeSDK, metrics, resources } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto'
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { logs, SeverityNumber } from '@opentelemetry/api-logs'

const OTLP_ENDPOINT = 'https://in-otel.logs.betterstack.com'
const API_KEY = process.env.BETTERSTACK_SOURCE_TOKEN ?? ''
const headers = { Authorization: `Bearer ${API_KEY}` }

const resource = resources.resourceFromAttributes({
  'service.name': 'timelines-backend',
  'service.version': '1.0.0',
  'deployment.environment': process.env.APP_ENV ?? 'dev',
})

// --- Logs ---
const loggerProvider = new LoggerProvider({
  resource,
  processors: [
    new BatchLogRecordProcessor(
      new OTLPLogExporter({ url: `${OTLP_ENDPOINT}/v1/logs`, headers })
    ),
  ],
})
logs.setGlobalLoggerProvider(loggerProvider)

// Bridge console.log/warn/error to OTel so existing log calls are forwarded
const otelLogger = loggerProvider.getLogger('console')

const severities: Record<string, number> = {
  log: SeverityNumber.INFO,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
}

for (const [method, severityNumber] of Object.entries(severities)) {
  const original = (console as any)[method].bind(console)
  ;(console as any)[method] = (...args: unknown[]) => {
    original(...args)
    otelLogger.emit({
      severityNumber,
      body: args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '),
    })
  }
}

// --- Traces + Metrics ---
const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({
    url: `${OTLP_ENDPOINT}/v1/traces`,
    headers,
  }),
  metricReader: new metrics.PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${OTLP_ENDPOINT}/v1/metrics`,
      headers,
    }),
    exportIntervalMillis: 30_000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // fs instrumentation is very noisy in Node.js — disable it
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
})

sdk.start()

process.on('SIGTERM', () => {
  Promise.all([sdk.shutdown(), loggerProvider.shutdown()]).finally(() =>
    process.exit(0)
  )
})
