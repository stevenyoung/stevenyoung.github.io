var roomData = {
  rooms :
  [
    {
      "id": 1,
      "name" : "Bedroom",
      "controls" :
      [
        {
          "type": "slider",
          "label": "temp",
          "defaultValue": 75,
          "currentValue": 75,
          "rangeValues":
          {
            "min": 65,
            "max": 90
          }
        },
        {
          "type": "toggle",
          "label": "light",
          "defaultValue": "off",
          "currentValue": "off",
          "toggleValues": ["on", "off"]
        },
        {
          "type": "multi",
          "label": "blinds",
          "defaultValue": "dim",
          "currentValue": "dim",
          "enumValues": "[\"open\", \"bright\", \"dim\", \"closed\"]",
          "rangeValues":
          {
            "min": 0,
            "max": 3
          }
        }
      ]
    },
    {
      "id": 2,
      "name" : "Kitchen",
      "controls" :
      [
        {
          "type": "slider",
          "label": "temp",
          "defaultValue": 75,
          "currentValue": 75,
          "rangeValues":
          {
            "min": 65,
            "max": 90
          }
        },
        {
          "type": "toggle",
          "label": "light",
          "defaultValue": "off",
          "currentValue": "off",
          "toggleValues": ["on", "off"]
        },
        {
          "type": "multi",
          "label": "blinds",
          "defaultValue": "dim",
          "currentValue": "dim",
          "enumValues": "[\"open\", \"bright\", \"dim\", \"closed\"]",
          "rangeValues":
          {
            "min": 0,
            "max": 3
          }
        }
      ]
    }
  ]
};
