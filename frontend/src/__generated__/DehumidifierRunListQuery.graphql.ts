/**
 * @generated SignedSource<<119447bab7d2b651afdf740f0fc0e29e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DehumidifierRunListQuery$variables = Record<PropertyKey, never>;
export type DehumidifierRunListQuery$data = {
  readonly dehumidifierRuns: ReadonlyArray<{
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
  }>;
};
export type DehumidifierRunListQuery = {
  response: DehumidifierRunListQuery$data;
  variables: DehumidifierRunListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "DehumidifierRun",
    "kind": "LinkedField",
    "name": "dehumidifierRuns",
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
    "name": "DehumidifierRunListQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DehumidifierRunListQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "a7d89a376b22299f25a376638f676d86",
    "id": null,
    "metadata": {},
    "name": "DehumidifierRunListQuery",
    "operationKind": "query",
    "text": "query DehumidifierRunListQuery {\n  dehumidifierRuns {\n    id\n    entityId\n    status\n    startTime\n    endTime\n    duration\n    startEnergyReading\n    endEnergyReading\n    energyConsumed\n    energyUnit\n    startedBy\n    humidityThreshold\n    startEventId\n    endEventId\n    errorMessage\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "e2d84dcf793c28c04577c534e9a7bd73";

export default node;
