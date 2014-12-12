/*
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

$tate = {};

$tate.Machine = function(var pStates){
	states = pStates;
}

$tate.Machine.prototype = {
	_states: {}, //string value pairs of possible states
	_currentState: null,
	_currentStateB: null,
	a: 0,
	function Update(var pA) {
		this.a = pA;
		if(_currentState) {
			_currentState(pA);
		}
		if(_currentStateB) {
			_currentStateB(pA);
		}
	},
	function Change(var pStateKey, var pUserData, var pA) {	//pA is the initialAlpha between the two states
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
	},
	function Register: function(var key, var func) {
		Assert(this._currentState);
		this._currentState.Register(key, func);
	}
}

$tate.State = function(pBeginFunc){
	this.beginFunc = pBeginFunc;
}

$tate.State.protoype = {
	beginFunc: null,
	Init: function() { //called when the state begins
		this.Sweeper = new $tate.Sweeper();
		this.beginFunc(this);
	},
	Cleanup: function() {
		//This assumes instantaneous cleanup...
		this.Sweeper.Cleanup();
		this.Sweeper = null;
	},
	Register: function(pFunc){
		this.Sweeper.Register(pFunc);
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


/* This is just a repository of functions that get called on 'cleanup' */
$tate.Sweeper = {
	eventList: [], //list of funcs to call on end state
	Register: function(var pToReg) {
		var eventList = this.eventList;
		if (typof eventList == "undefined" || eventList == null) {
			eventList = [];
		}
		//if it's an object that's passed in, just wrap it in a function that calls that objects 'cleanup'
		var func = typeof pToReg == "function"? func : this.GenFunc_Cleanup(pToReg);
		eventList.push(func);
		return func;
	},
	Unregister: function(var pToUnReg) {
		for(key in this.eventList) {
			if(this.eventList[key] == pToUnReg) {
				this.evenList[key] = null; //Not removing from array as this would make cleanup a pain
			}
		}
	},
	Cleanup: function(pUserData) {
		for (key in this.eventList) {
			var pFunc = this.eventList[key];
			if(pFunc != null) {
				pFunc(pUserData);
			}
		}
		this.eventList = [];
	},
	GenFunc_Cleanup(var obj) {
		return function(pUserData){obj.Cleanup(pUserData)};
	},
}

$tate.UiObject = function(var pSweeper) {
	var coatCheckTag = pSweeper.Register(pSweeper.GenFunc_Cleanup(this));
	this.sweeper = pSweeper;
}

$tate.UiObject.prototype = {
	coatCheckTag: null,
	Cleanup: function() {
		if(this.coatCheckTag) {
			this.Sweeper.Unregister(this.coatCheckTag);
			this.coatCheckTag = null;
		}
	}
}