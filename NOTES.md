# Homeassistant


```yaml
alias: Ingest Shelly Switch Event
trigger:
  - platform: state
    entity_id: switch.shellyplus1pm_fce8c0fdc4e0_switch_0
  - platform: device
    device_id: 3fcf21ef88090c2c5ea06102f9b1a157
    domain: shelly
    type: single_push
    subtype: button1
action:
  - service: rest_command.ingest_dehumidifier_event
    data:
      eventtype: DEHUMIDIFIER
      payload: |-
        {{
          {
          
            "entity_id": trigger.entity_id if trigger.entity_id is defined else "",
            "from_state": trigger.from_state.state if trigger.from_state is defined and trigger.from_state.state is defined else "",
            "to_state": trigger.to_state.state if trigger.to_state is defined and trigger.to_state.state is defined else "",
            "attributes": trigger.to_state.attributes if trigger.to_state is defined and trigger.to_state.attributes is defined else {},
            "last_changed": trigger.to_state.last_changed.isoformat() if trigger.to_state is defined and trigger.to_state.last_changed is defined else "",
            "last_updated": trigger.to_state.last_updated.isoformat() if trigger.to_state is defined and trigger.to_state.last_updated is defined else ""          
          } | tojson | replace('\"', '\\\"')
        }}
```