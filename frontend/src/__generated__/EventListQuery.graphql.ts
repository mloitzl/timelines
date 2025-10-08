/**
 * @generated SignedSource<<21a2a8e8e98805944d5e037389340912>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EventListQuery$variables = Record<PropertyKey, never>;
export type EventListQuery$data = {
  readonly events: ReadonlyArray<{
    readonly eventType: string;
    readonly id: string;
    readonly payload: any | null | undefined;
    readonly timestamp: string;
  }>;
};
export type EventListQuery = {
  response: EventListQuery$data;
  variables: EventListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Event",
    "kind": "LinkedField",
    "name": "events",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "eventType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "timestamp",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "payload",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "EventListQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "EventListQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "b1086f9df9fb6f21263f0dea4d99facf",
    "id": null,
    "metadata": {},
    "name": "EventListQuery",
    "operationKind": "query",
    "text": "query EventListQuery {\n  events {\n    id\n    eventType\n    timestamp\n    payload\n  }\n}\n"
  }
};
})();

(node as any).hash = "43b06f46dcf21558dd9eeadb2ebee779";

export default node;
