
$tate.Machine = function(var pStates){
	states = pStates;
}

$tate.Machine.prototype = {
	_states: {}, //string value pairs of possible states
	_currentState: null,
	function Change(var pStateKey) {
		var newState = _states[pStateKey];
		Assert(typeof newState != "undefined" && newState != null);
		if(_currentState != null) {
			this.CleanupCurrentState();
			newState.Init();
		}
	},
	function CleanupCurrentState() {
	
	},
	function BeginMultiState(var pStateKeyA, var pStateKeyB, pFinishedCallback) {
		
	}
}

$tate.State = function(pBeginFunc){
	this.beginFunc = pBeginFunc;
}

$tate.State.protoype = {
	beginFunc: null,
	updateFunc: null,
	_cleanupList: [], //list of funcs to call on end state
	Init: function() { //called when the state begins
		this.beginFunc(this);
	},
	Cleanup: function() {
		//This assumes instantaneous cleanup...
		for (key in this._cleanupList) {
			this._cleanupList[key]();
		}		
	},
	GenFunc_Cleanup(var obj) {
		return function(){obj.Cleanup()};
	},
	OnCleanup: function(var key, var func) {
		var eventList = cleanupList;
		if (typof eventList == "undefined" || eventList == null) {
			eventList = [];
		}
		eventList.push(func);
	}	
}

$tate.TState = function(){


}