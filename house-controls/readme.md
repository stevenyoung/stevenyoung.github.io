Control Panel

Features:
Supports multiple types of switches:
- ranged values, e.g. a thermostat
- toggled values, e.g. a light switch
- enumerated values, e.g. window blinds

Usage:
To create a new control panel:
`cp = new ControlPanel(name);`

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
Store contains methods to retrieve data and update local storage based on user activity.
Model is an interface with basic CRUD methods used by the controller to interact with storage.
The view represents the DOM elements for the control panel.
And the template object containing the HTML layout.
The controller has model and view properties

(Copied from homeSimulator.js):

`function Store(name) {...`
/**
* Storage for the control panel
* On page load default data is retrieved from local static file via XHR.
* If viewing the file using the file:// protocol then
* The JSON data is stored in localStorage and updates are stored there.
* Persisting to server is not currently possible.
*
* @param {string} name - property containing values for localStorage
*/

`Store.prototype.save = function(updateData, callback) {...`
/**
* Save updated values to localStorage
* @param {Object} - updateData
* {
*   ctrltype: control type (toggle||slider||multi),
*   id: room identifier,
*   value: value to be saved for control
* }
*/

`Store.prototype.retrieveAll = function(callback) {...`
/**
* Get room data via XHR, static file - 'rooms.json',
* Copy stringified data to localStorage for updating
*
* I've also included a fallback to use an included javascript file
* in case this is viewed via file:// for instance.
* @callback {function} callback to be run after data is retrieved
*/

`function Model(storage) {...`
/**
* Model - contains methods for reading, updating control settings
* @param {Object} - storage for model
*/

`function View(template) {...`
/**
* View represents DOM
* template arg is the layout
* $roomlist is the DOM element we are working with
* bind() register event handlers
* render( display data in template)
* @param {object} template - HTML layout template used by the view
*/

`View.prototype.render = function(cmd, args) {...`
/**
* Pick a view to render
* TODO: add filters for viewing rooms or control types
* @param {string} cmd - view to render
* @param {Object} args - data to pass to view template
*/

`View.prototype.updateDisplayValues = function(updateData) {...`
/**
* Refresh control settings after user update
*
* @param {Object} updateData
* {
*   ctrltype: control type (toggle||slider||multi),
*   id: room identifier,
*   value: value to be saved for control
* }
*
* Function can be supplied as callback to be run after saving settings to store
*/

`View.prototype.bind = function(event, handler) {...`
/**
* Bind input elements to UI events with provided event handler
* Controller calls this providing a name for the event, handler function
* Elements are selected by control type.
* Uses delegated targets.
*
* @param {string} event named by controller
* @param {function} handler function to be run by
*/

`function Controller(model, view) {...`
/**
* Constructor for controller.
* Given a model and a view, make sure they play nice, i.e. collaborate without coupling.
*/

`Controller.prototype.showAll = function() {...`
/**
* Show all controls, set bindings. This is run on page load.
*/

`Controller.prototype.setView = function() {...`
/*
* Choose view- (currently a view of a panel for all controls in all rooms)
* But this is where i'd like to add views filtered by room or control type
*/

`Controller.prototype.saveControlSetting = function(ctrlData, value) {...`
/**
* Save an updated control value
*
* @param {object} ctrlData {id: room id, ctrltype: type of control}
* @value {string} value
*/

`function Template() {...`
/*
* HTML Templates
* Basic. Using String.replace(). This is a toy app after all.
* formatting this way helps legibility (for me anyway).
*/

`Template.prototype.show = function(data) {...`
/**
* Returns a template populated with values from data.
* @param {object} data - room and controls data to be displayed in template
*/
