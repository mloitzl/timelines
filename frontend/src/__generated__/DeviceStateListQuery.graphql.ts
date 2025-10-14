/**
 * @generated SignedSource<<86d2d11145869304eefaf780b715a060>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeviceStateListQuery$variables = Record<PropertyKey, never>;
export type DeviceStateListQuery$data = {
  readonly deviceStates: ReadonlyArray<{
    readonly attributes: any | null | undefined;
    readonly currentState: string;
    readonly entityId: string;
    readonly friendlyName: string | null | undefined;
    readonly id: string;
    readonly lastChanged: string;
    readonly lastEventId: string;
    readonly updatedAt: string;
  }>;
};
export type DeviceStateListQuery = {
  response: DeviceStateListQuery$data;
  variables: DeviceStateListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "DeviceState",
    "kind": "LinkedField",
    "name": "deviceStates",
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
    "name": "DeviceStateListQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DeviceStateListQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "32f0c6feb21edde3e55e4bdecfc3338f",
    "id": null,
    "metadata": {},
    "name": "DeviceStateListQuery",
    "operationKind": "query",
    "text": "query DeviceStateListQuery {\n  deviceStates {\n    id\n    entityId\n    currentState\n    friendlyName\n    lastChanged\n    lastEventId\n    attributes\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "0c2340be3e85b87a748c86ebfa16fc7d";

export default node;
