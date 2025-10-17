# Homeassistant Configs


## REST command


```yaml
rest_command:
  ingest_dehumidifier_event:
    url: "http://werkstatt:4000/graphql"
    method: POST
    headers:
      Content-Type: "application/json"
    payload: >
      {
        "query": "mutation Mutation($eventType: String!, $payload: JSON) {  ingestEvent(eventType: $eventType, payload: $payload) {    id    eventType    timestamp    payload  }}",
        "variables": {
          "eventType": "{{ eventtype }}",
          "payload": {{ payload | tojson }}
        }
      }
```

## Ingest Shelly Switch Event

```yaml
alias: Ingest Shelly Switch Event
trigger:
  - platform: state
    entity_id: switch.shellyplus1pm_fce8c0fdc4e0_switch_0
action:
  - service: rest_command.ingest_dehumidifier_event
    data:
      eventtype: DEHUMIDIFIER
      payload:
        entity_id: "{{ trigger.entity_id if trigger.entity_id is defined else null }}"
        from_state: >-
          {{ trigger.from_state.state if trigger.from_state is defined else null
          }}
        to_state: "{{ trigger.to_state.state if trigger.to_state is defined else null }}"
        from_last_changed: >-
          {{ trigger.from_state.last_changed.isoformat() if trigger.from_state
          is defined and trigger.from_state.last_changed is defined else null }}
        to_last_changed: >-
          {{ trigger.to_state.last_changed.isoformat() if trigger.to_state is
          defined and trigger.to_state.last_changed is defined else null }}
        from_attributes: >-
          {{ trigger.from_state.attributes if trigger.from_state is defined else
          {} }}
        to_attributes: >-
          {{ trigger.to_state.attributes if trigger.to_state is defined else {}
          }}
        energy_reading: "{{ states('sensor.shellyplus1pm_fce8c0fdc4e0_switch_0_energy') }}"
        energy_unit: >-
          {{ state_attr('sensor.shellyplus1pm_fce8c0fdc4e0_switch_0_energy',
          'unit_of_measurement') }}
        humidity_reading: "{{ states('sensor.atc_3d2f_humidity') }}"
        humidity_unit: >-
          {{ state_attr('sensor.atc_3d2f_humidity', 'unit_of_measurement') }}
        temperature_reading: "{{ states('sensor.atc_3d2f_temperature') }}"
        temperature_unit: >-
          {{ state_attr('sensor.atc_3d2f_temperature', 'unit_of_measurement') }}
```

sensor.atc_3d2f_humidity
sensor.atc_3d2f_temperature

## Dehumidifier automation


```yaml
alias: Dehumidifier Control by Humidity
description: Turns Shelly-powered dehumidifier on/off depending on humidity threshold
trigger:
  - platform: state
    entity_id: sensor.atc_3d2f_humidity
action:
  - choose:
      - conditions:
          - condition: template
            value_template: |
              {{ states('sensor.atc_3d2f_humidity') | float >
                 states('input_number.humidity_threshold') | float }}
        sequence:
          - service: switch.turn_on
            entity_id: switch.shellyplus1pm_fce8c0fdc4e0_switch_0
          - wait_for_trigger:
              - platform: template
                value_template: |
                  {{ states('sensor.atc_3d2f_humidity') | float <
                     (states('input_number.humidity_threshold') | float * 0.95) }}
            timeout: "12:00:00"
          - service: switch.turn_off
            entity_id: switch.shellyplus1pm_fce8c0fdc4e0_switch_0
    default: []
mode: single
```

## Deactivate Dehumidifier automation

```yaml
alias: Entfeuchter deaktivieren/aktivieren
description: Toggle automation on/off with button - first press disables for 1h, second press re-enables immediately
trigger:
  - platform: device
    device_id: 3fcf21ef88090c2c5ea06102f9b1a157
    domain: shelly
    type: single_push
    subtype: button1
condition: []
action:
  - choose:
      # If automation is currently ON, disable it
      - conditions:
          - condition: state
            entity_id: automation.dehumidifier_control_by_humidity
            state: "on"
        sequence:
          - device_id: 4e28b102c6aa05bcd16ed2d8cbee2f33
            domain: mobile_app
            type: notify
            message: Entfeuchter deaktiviert für 1 Stunde
          - service: automation.turn_off
            entity_id: automation.dehumidifier_control_by_humidity
          # Turn off dehumidifier if it's currently running
          - service: switch.turn_off
            entity_id: switch.shellyplus1pm_fce8c0fdc4e0_switch_0
          - delay: "01:00:00"
          - service: automation.turn_on
            entity_id: automation.dehumidifier_control_by_humidity
          - device_id: 4e28b102c6aa05bcd16ed2d8cbee2f33
            domain: mobile_app
            type: notify
            message: Entfeuchter automatisch aktiviert
      # If automation is currently OFF, enable it immediately
      - conditions:
          - condition: state
            entity_id: automation.dehumidifier_control_by_humidity
            state: "off"
        sequence:
          - service: automation.turn_on
            entity_id: automation.dehumidifier_control_by_humidity
          # Turn off switch if button accidentally turned it on
          - service: switch.turn_off
            entity_id: switch.shellyplus1pm_fce8c0fdc4e0_switch_0
          - device_id: 4e28b102c6aa05bcd16ed2d8cbee2f33
            domain: mobile_app
            type: notify
            message: Entfeuchter manuell aktiviert
    default: []
mode: restart
```

## Ingest Dehumidifier Automation State Changes

```yaml
alias: Ingest Dehumidifier Automation State Event
trigger:
  - platform: state
    entity_id: automation.dehumidifier_control_by_humidity
    to: "on"
    id: automation_enabled
  - platform: state
    entity_id: automation.dehumidifier_control_by_humidity
    to: "off"
    id: automation_disabled
action:
  - service: rest_command.ingest_dehumidifier_event
    data:
      eventtype: DEHUMIDIFIER_AUTOMATION
      payload:
        entity_id: "{{ trigger.entity_id }}"
        from_state: "{{ trigger.from_state.state }}"
        to_state: "{{ trigger.to_state.state }}"
        from_last_changed: "{{ trigger.from_state.last_changed.isoformat() }}"
        to_last_changed: "{{ trigger.to_state.last_changed.isoformat() }}"
        trigger_id: "{{ trigger.id }}"
        automation_name: "Dehumidifier Control by Humidity"
mode: queued
```