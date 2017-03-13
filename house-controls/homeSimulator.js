/**
* Storage for the control panel
* On page load default data is retrieved from local static file via XHR.
* If viewing the file using the file:// protocol then
* The JSON data is stored in localStorage and updates are stored there.
* Persisting to server is not currently possible.
*
* @param {string} name - property containing values for localStorage
*/
function Store(name) {
  // saving to local storage
  this.dbName = name;
}

/**
* Save updated values to localStorage
* @param {Object} - updateData 
* { 
*   ctrltype: control type (toggle||slider||multi), 
*   id: room identifier,
*   value: value to be saved for control
* }
*/
Store.prototype.save = function(updateData, callback) {
  var rooms = JSON.parse(localStorage[this.dbName]).rooms;
  for (var i=0; i<rooms.length; i++) {
    if (rooms[i].id === parseInt(updateData.id)) {
      var controls = rooms[i].controls;
      for (var ii=0; ii<controls.length; ii++) {
        if (controls[ii].type === updateData.ctrltype) {
          rooms[i].controls[ii].currentValue = updateData.value;
          break;
        }
      }
    }
  }
  localStorage[this.dbName] = JSON.stringify({rooms: rooms});
  callback = callback || function() {}
  callback.call(this, updateData);
};

/**
* Not used currently but...
* @param {int} id - id of room to be removed
*/
Store.prototype.remove = function(id) {
  var data = JSON.parse(localStorage[this.dbName]).data;
  var rooms = data.rooms;
  var i;
  for (i = rooms.length - 1; i >= 0; i--) {
    if (rooms[i].id == id) {
      rooms.splice(i, 1);
      break;
    }
  }
  localStorage[this.dbName] = JSON.stringify(data);
}

/**
* Get room data via XHR, static file - 'rooms.json', 
* Copy stringified data to localStorage for updating
* 
* I've also included a fallback to use an included javascript file
* in case this is viewed via file:// for instance.
* @callback {function} callback to be run after data is retrieved
*/
Store.prototype.retrieveAll = function(callback) {
  callback = callback || function() {}
  var self = this;
  var $reqXHR = $.ajax({
    url: "rooms.json",
  })
  .done( function(data) {
    localStorage[self.dbName] = JSON.stringify(data);
    callback.call(this, data);
  })
  .fail( function(data) { 
    localStorage[self.dbName] = JSON.stringify(roomData);
    callback.call(this, roomData);
  })
}

/**
* Model - contains methods for reading, updating control settings
* @param {Object} - storage for model
*/
function Model(storage) {
  this.storage = storage;
}

Model.prototype.create = function(name) {

}

Model.prototype.read = function(callback) {
  callback = callback || function() {};
  this.storage.retrieveAll(callback);
}

Model.prototype.update = function(data, callback) {
  callback = callback || function() {};
  this.storage.save(data, callback);
}

Model.prototype.remove = function(id) {

}

/**
* View represents DOM
* template arg is the layout
* $roomlist is the DOM element we are working with
* bind() register event handlers
* render( display data in template)
* @param {object} template - HTML layout template used by the view
*/
function View(template) {
  this.template = template;
  this.$roomlist = $('#roomlist');
}

/**
* Pick a view to render
* TODO: add filters for viewing rooms or control types
* @param {string} cmd - view to render
* @param {Object} args - data to pass to view template
*/
View.prototype.render = function(cmd, args) {
  var self = this;
  var viewCommands = {
    showAllControls: function() {
      self.$roomlist.append(self.template.show(args));
    },
    updateControlValues: function(updateData) {
      self.updateDisplayValues();
    }
  }
  viewCommands[cmd]();
}

/**
* Refresh control settings after user update 
*
* @oarams {Object} updateData 
* { 
*   ctrltype: control type (toggle||slider||multi), 
*   id: room identifier,
*   value: value to be saved for control
* }
* 
* Function can be supplied as callback to be run after saving settings to store
*/

View.prototype.updateDisplayValues = function(updateData) {
  var updatedElemSelector 
  = '[data-ctrltype='  + updateData.ctrltype + ']' 
  + '[data-roomid=' + updateData.id + ']';
  if (updateData.ctrltype === 'toggle') {
    updatedElemSelector = updatedElemSelector + ' input';
  } else {
    updatedElemSelector = updatedElemSelector + ' output';
  }
  $(updatedElemSelector).val(updateData.value);
}

/**
* Bind input elements to UI events with provided event handler
* Controller calls this providing a name for the event, handler function
* Elements are selected by control type.
* Uses delegated targets.
* 
* @param {string} event named by controller
* @param {function} handler function to be run by
*/
View.prototype.bind = function(event, handler) {
  var self = this;
  if (event === 'toggleClick' ) {
    $('[data-ctrltype=toggle]').on('click', 'input', handler);
  } else if (event === 'adjustSlider') {
    $('[data-ctrltype=slider]').on('input', 'input', handler);
  } else if (event === 'adjustMulti') {
    $('[data-ctrltype=multi]').on('input', 'input', handler);
  }
}

/**
* Given a model and a view make sure they play nice,
* i.e. collaborate without coupling.
*/

function Controller(model, view) {
  this.model = model;
  this.view = view;
}

/**
* Show all controls, set bindings. This is run on page load.
*/
Controller.prototype.showAll = function() {
  var self = this;
  self.model.read(function(data) {
    self.view.render('showAllControls', data);
    self.view.bind('toggleClick', function(event) {
      var data = event.delegateTarget.dataset;
      self.saveControlSetting(data, $(this).is(':checked'));
    });
    self.view.bind('adjustSlider', function(event) {
      self.saveControlSetting(event.delegateTarget.dataset, event.target.value);
    })
    self.view.bind('adjustMulti', function(event) {
      self.saveControlSetting(event.delegateTarget.dataset, event.target.value);
    })
  });
}

/*
* Choose view- (currently a view of a panel for all controls in all rooms)
* But this is where i'd like to add views filtered by room or control type
*/
Controller.prototype.setView = function() {
  this.showAll();
}

/**
* Save an updated control value
*
* @param {object} ctrlData {id: room id, ctrltype: type of control}
* @value {string} value
*/
Controller.prototype.saveControlSetting = function(ctrlData, value) {
  var updateData = {
    id: ctrlData.roomid,
    ctrltype: ctrlData.ctrltype,
    value: value
  }
  if (ctrlData.ctrltype === 'toggle') {
    updateData.value = value ? "on" : "off";  
  } else if (ctrlData.ctrltype === 'multi') {
    updateData.value = ["open", "bright", "dim", "closed"][value]; 
  }
  this.model.update(updateData, this.view.updateDisplayValues);
}

/*
* HTML Templates
* Basic. Using String.replace(). This is a toy app after all.
* formatting this way helps legibility (for me anyway).
*/

function Template() {
  this.roomTemplate
  = '<li data-roomId="{{roomId}}">{{name}}<ul>{{controlPanel}}</ul></li>';

  this.controlTemplate = {};

  this.controlTemplate.slider
  = '<li class="slider" data-ctrltype="slider" data-roomId={{roomId}}>'
  + ' <label class="control-label">{{label}}</label>'
  + ' <form>'
  + '   <output name="slideroutput">{{displayValue}}</output>'
  + '   <input name="sliderinput" type="range" min="{{min}}" max="{{max}}" value="{{defaultValue}}" class="vertical thermostat">'
  + ' </form>'
  + '</li>';

  this.controlTemplate.toggle
  = '<li data-ctrltype="toggle" data-roomId={{roomId}}>'
  + ' <label class="control-label">{{label}}</label>'
  + ' <label class="switch">'
  + '   <input type="checkbox">'
  + '   <div class="toggle"></div>'
  + ' </label>'
  + '</li>';

  this.controlTemplate.multi
  = '<li class="multi" data-ctrltype="multi" data-roomId={{roomId}} >'
  + ' <label class="control-label">{{label}}</label>'
  + ' <form>'
  + '   <br><output name="multioutput">{{defaultValue}}</output><br>'
  + '   <input name="multiinput" type="range" min="{{min}}" max="{{max}}" step="1" />'
  + ' </form>'
  + '</li>';
}

/**
* Returns a template populated with values from data.
* @param {object} data - room and controls data to be displayed in template
*/
Template.prototype.show = function(data) {
  var view = '';
  var rooms = data.rooms;
  for (var i=0; i<rooms.length; i++) {
    view = view + this.roomTemplate;
    view = view.replace('{{name}}', rooms[i].name);
    view = view.replace('{{roomId}}', rooms[i].id);
    var controlpanelLayout = ''
    var controls = rooms[i].controls;
    for (var ii=0; ii<controls.length; ii++) {
      var ctrl = controls[ii];
      var template = this.controlTemplate[ctrl.type] + '';
      template = template.replace('{{roomId}}', rooms[i].id);
      template = template.replace('{{defaultValue}}', ctrl.defaultValue);
      template = template.replace('{{label}}', ctrl.label);
      if (ctrl.type !== 'toggle') {
        template = template.replace('{{displayValue}}', ctrl.defaultValue),
        template = template.replace('{{min}}', ctrl.rangeValues.min);
        template = template.replace('{{max}}', ctrl.rangeValues.max);
      }
      controlpanelLayout = controlpanelLayout + template;
    }
    view = view.replace('{{controlPanel}}', controlpanelLayout);
  }
  return view;
}

/**
* Control panel application
* Let's put the objects above together.
*/

function ControlPanel(name) {
  this.storage = new Store(name);
  this.model = new Model(this.storage);
  this.template = new Template();
  this.view = new View(this.template);
  this.controller = new Controller(this.model, this.view);
}

// new control panel
var cp = new ControlPanel('home');

// Set an initial view
function loadControlPanel() {
  cp.controller.setView();
}

$(document).ready(function () {
  loadControlPanel();
});
