/**
 * @generated SignedSource<<0c0eb7bd1a57c7864b7f8c6baf40b727>>
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
    readonly endHumidityReading: number | null | undefined;
    readonly endTemperatureReading: number | null | undefined;
    readonly endTime: string | null | undefined;
    readonly energyConsumed: number | null | undefined;
    readonly energyUnit: string;
    readonly entityId: string;
    readonly errorMessage: string | null | undefined;
    readonly humidityThreshold: number | null | undefined;
    readonly humidityUnit: string | null | undefined;
    readonly id: string;
    readonly startEnergyReading: number;
    readonly startEventId: string;
    readonly startHumidityReading: number | null | undefined;
    readonly startTemperatureReading: number | null | undefined;
    readonly startTime: string;
    readonly startedBy: string;
    readonly status: string;
    readonly temperatureUnit: string | null | undefined;
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
        "name": "startHumidityReading",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endHumidityReading",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "humidityUnit",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startTemperatureReading",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endTemperatureReading",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "temperatureUnit",
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
    "cacheID": "39ab59ef7b9fc8ff9279ac822e2db693",
    "id": null,
    "metadata": {},
    "name": "DehumidifierRunListSubscription",
    "operationKind": "subscription",
    "text": "subscription DehumidifierRunListSubscription {\n  dehumidifierRunChanged {\n    id\n    entityId\n    status\n    startTime\n    endTime\n    duration\n    startEnergyReading\n    endEnergyReading\n    energyConsumed\n    energyUnit\n    startHumidityReading\n    endHumidityReading\n    humidityUnit\n    startTemperatureReading\n    endTemperatureReading\n    temperatureUnit\n    startedBy\n    humidityThreshold\n    startEventId\n    endEventId\n    errorMessage\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "1142470c9cc0504dbfee7f7cd6a2ec5d";

export default node;
