import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const exporter = new OTLPTraceExporter({
 url: 'http://3.106.54.87:4318/v1/traces', // use public ip of ubuntu vm and specify proxy port
 headers: {}
});
const provider = new WebTracerProvider({
 resource: new Resource({
   [SemanticResourceAttributes.SERVICE_NAME]: 'umi-frontend', // can use 'process.env.APP_NAME' instead of this
 }),
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register({
 contextManager: new ZoneContextManager()
});

registerInstrumentations({
 instrumentations: [
   getWebAutoInstrumentations({
     // load custom configuration for xml-http-request instrumentation
     '@opentelemetry/instrumentation-xml-http-request': {
       propagateTraceHeaderCorsUrls: [
           /.+/g,
         ],
     },
     // load custom configuration for fetch instrumentation
     '@opentelemetry/instrumentation-fetch': {
       propagateTraceHeaderCorsUrls: [
           /.+/g,
         ],
     },
   }),
 ],
});

export default function TraceProvider ({ children }) {
  return (
    <>
      {children}
    </>
  );
}