/**
 * @generated SignedSource<<572d1b17ec612943f62ab75bbdb87e3f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EventListSubscription$variables = Record<PropertyKey, never>;
export type EventListSubscription$data = {
  readonly eventIngested: {
    readonly eventType: string;
    readonly id: string;
    readonly payload: any | null | undefined;
    readonly timestamp: string;
  };
};
export type EventListSubscription = {
  response: EventListSubscription$data;
  variables: EventListSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Event",
    "kind": "LinkedField",
    "name": "eventIngested",
    "plural": false,
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
    "name": "EventListSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "EventListSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "19003c0a8dda68be0d5e58f987ed6ff8",
    "id": null,
    "metadata": {},
    "name": "EventListSubscription",
    "operationKind": "subscription",
    "text": "subscription EventListSubscription {\n  eventIngested {\n    id\n    eventType\n    timestamp\n    payload\n  }\n}\n"
  }
};
})();

(node as any).hash = "d17629187cbc691c5e7016c4fcd6fbe8";

export default node;
