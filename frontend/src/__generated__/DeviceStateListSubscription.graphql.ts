/**
 * @generated SignedSource<<9801cf2c88b42502304ca7903633f1a5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeviceStateListSubscription$variables = Record<PropertyKey, never>;
export type DeviceStateListSubscription$data = {
  readonly deviceStateChanged: {
    readonly attributes: any | null | undefined;
    readonly currentState: string;
    readonly entityId: string;
    readonly friendlyName: string | null | undefined;
    readonly id: string;
    readonly lastChanged: string;
    readonly lastEventId: string;
    readonly updatedAt: string;
  };
};
export type DeviceStateListSubscription = {
  response: DeviceStateListSubscription$data;
  variables: DeviceStateListSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "DeviceState",
    "kind": "LinkedField",
    "name": "deviceStateChanged",
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
        "name": "entityId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "currentState",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "friendlyName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastChanged",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastEventId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "attributes",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
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
    "name": "DeviceStateListSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DeviceStateListSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ab7c534c9fbbfffaa0797c97e3c68dcb",
    "id": null,
    "metadata": {},
    "name": "DeviceStateListSubscription",
    "operationKind": "subscription",
    "text": "subscription DeviceStateListSubscription {\n  deviceStateChanged {\n    id\n    entityId\n    currentState\n    friendlyName\n    lastChanged\n    lastEventId\n    attributes\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "8c0600f7e78dab26c7d78132cc315979";

export default node;
