
$tate.Machine = function(var pStates){
	states = pStates;
}

$tate.Machine.prototype = {
	_states: {}, //string value pairs of possible states
	_currentState: null,
	_currentStateB: null,
	a: 0,
	function Change(var pStateKey, var pUserData, var pA) {
	
		var stateKey = null;
		var stateKeyB = null;		
		if (typeof pStateKey == "Array") {
			stateKey = pStateKey[0];
			stateKeyB = pStateKey[1];
		} else {
			stateKey = pStateKey;
			stateKeyB = null;				
		}
		var newState = _states[pStateKey];
		var newStateB = pStateBKey? _states[pStateBKey] : null;
		}
		Assert(typeof newState != "undefined" && newState != null);
				
		this.CleanupCurrentState();	
		a = pA? pA : 0;
		_currentState = newState;
		_currentStateB = newStateB;
		this.StartCurrentState(pUserData);
	},
	function CleanupCurrentState() {
		if(_currentState) {
			_currentState.Cleanup(a);
		}		
		if(_currentStateB) {
			_currentStateB.Cleanup(a);
		}		
	},
	function StartCurrentState(pUserData) {
		if(_currentState) {
			_currentState.Init(pUserData, a);
		}		
		if(_currentStateB) {
			_currentStateB.Cleanup(pUserData, a);
		}		
	}
}

$tate.State = function(pBeginFunc){
	this.beginFunc = pBeginFunc;
}

$tate.State.protoype = {
	beginFunc: null,
	_cleanupList: [], //list of funcs to call on end state
	Init: function() { //called when the state begins
		this.beginFunc(this);
	},
	Cleanup: function() {
		//This assumes instantaneous cleanup...
		for (key in this._cleanupList) {
			this._cleanupList[key]();
		}
		this._cleanupList = [];
	},
	GenFunc_Cleanup(var obj) {
		return function(){obj.Cleanup()};
	},
	Register: function(var key, var func) {
		var eventList = cleanupList;
		if (typof eventList == "undefined" || eventList == null) {
			eventList = [];
		}
		eventList.push(func);
	}	
}

$tate.TState = function(pBeginFunc){
	$tate.State.call(this, pBeginFunc)
}

$tate.TState.prototype = Object.create($tate.State.prototype, {
	updateFunc: null,
	Update: function(var a) {
		updateFunc(a);
	}
});