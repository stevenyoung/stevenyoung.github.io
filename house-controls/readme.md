Control Panel

Features:
Supports multiple types of switches:
- ranged values, e.g. a thermostat
- toggled values, e.g. a light switch
- enumerated values, e.g. window blinds

Usage:
To create a new control panel:
`cp = new ControlPanel();`

Get some room data:
`cp.loadRoomData();`

Description:
The room data will contain a list of rooms and the controls within.
The sample rooms have a thermostat, light switch and blinds control.
The thermostat controls are a variable slider with a range.
The blinds control are a slider with presets and the lght switch is a toggle.
Interaction with the control panel will update the settings and the room data.

Approach:
Mockup:
As the visual representation of the settings and update controls were a key requirement, I decided to start with a mockup in HTML that used inline Javascript as HTML attributes and CSS to display basic control settings.
The sliders in the mockup update via inline JavaScript, using input elements and form onValue attributes to update values for HTML output tags.
The toggle switches use CSS pseudoclasses to update the appearance of the checkbox input based on checked state.
Once I had a mockup that updated the slider and checkbox controls with only some basic inline JavaScript I started on a version that would read its settings from the network and store updates to those settings.

Application:
Splitting the app code into separate objects for storage, a model object to interact with this atorage.
Store conta
The view represents the DOM elements for the control panel with the template object containing the HTML layout.
The controller has model and view properties
