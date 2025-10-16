/**
 * @generated SignedSource<<52f800367cb43cfbac3091d173aa5913>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DehumidifierRunListSubscription$variables = Record<PropertyKey, never>;
export type DehumidifierRunListSubscription$data = {
  readonly dehumidifierRunChanged: {
    readonly createdAt: string;
    readonly duration: number | null | undefined;
    readonly endEnergyReading: number | null | undefined;
    readonly endEventId: string | null | undefined;
    readonly endTime: string | null | undefined;
    readonly energyConsumed: number | null | undefined;
    readonly energyUnit: string;
    readonly entityId: string;
    readonly errorMessage: string | null | undefined;
    readonly humidityThreshold: number | null | undefined;
    readonly id: string;
    readonly startEnergyReading: number;
    readonly startEventId: string;
    readonly startTime: string;
    readonly startedBy: string;
    readonly status: string;
    readonly updatedAt: string;
  };
};
export type DehumidifierRunListSubscription = {
  response: DehumidifierRunListSubscription$data;
  variables: DehumidifierRunListSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "DehumidifierRun",
    "kind": "LinkedField",
    "name": "dehumidifierRunChanged",
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
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "duration",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startEnergyReading",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endEnergyReading",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "energyConsumed",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "energyUnit",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startedBy",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "humidityThreshold",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startEventId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endEventId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "errorMessage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
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
    "name": "DehumidifierRunListSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DehumidifierRunListSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ed8b9a6fd0b14458bcd795af7395bc5e",
    "id": null,
    "metadata": {},
    "name": "DehumidifierRunListSubscription",
    "operationKind": "subscription",
    "text": "subscription DehumidifierRunListSubscription {\n  dehumidifierRunChanged {\n    id\n    entityId\n    status\n    startTime\n    endTime\n    duration\n    startEnergyReading\n    endEnergyReading\n    energyConsumed\n    energyUnit\n    startedBy\n    humidityThreshold\n    startEventId\n    endEventId\n    errorMessage\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "1cf7ce8184d0818312ea2d87aecc84fe";

export default node;
