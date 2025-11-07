
const Assert = require('assert');
const EventEmitter = require('node:events');

// debug if appropriate
//let debug; try { debug = require('debug')('fsm'); }
//catch (e) { debug = function(){}; } // empty stub

const _state = Symbol('state');
const _map = Symbol('next');
const _previous = Symbol('previous');
//const _default = Symbol('default');

const isSet = s => s instanceof Set;
const isMap = m => m instanceof Map;

/**
 * Finite state machine
 */
class FiniteStateMachine extends EventEmitter
{
  /**
   * Constructor
   * @param {Map} next State map.
   * @param {String} start Initial state.
   */
  constructor(next, start = null)
  {
    super();

    if (!isMap(next)) throw new TypeError('next parameter must be Map{}');
    if (typeof start !== 'string' && start !== null) throw new TypeError('start parameter must be a String or null');

    this[_state] = start;
    this[_previous] = null;
    this[_map] = next;
  }

  get state() { return this[_state] }

  get previous() { return this[_previous] }

  next(state)
  {
    if (typeof state != 'string') {
      throw new TypeError('Parameter state must be string');
    }

    if (!this[_map].has(this.state)) {
      throw new Error(`'${this.state}' does not exist in transition map`);
    }
    const allowed = this[_map].get(this.state);
    if (!isSet(allowed)) {
      throw new TypeError('Invalid Set: '+allowed);
    }
    if (!allowed.has(state)) {
      throw new Error(`Next state from '${this.state}' does not include '${state}'`);
    }

    this[_previous] = this[_state];
    this[_state] = state;

    this.emit(state);
    return true;
  }
}

/**
 * Create finite state machine.
 * @param {Map} next State map.
 * @param {String|Null} start Initial state, default is null.
 * @returns {FiniteStateMachine}
 */
function createFsm(next, start = null) {
  return new FiniteStateMachine(next, start);
}

/*
class Transitions
{
  constructor(...arr) {
    const self = this;
    debug('Transitions.constructor:',...arr);
    let opt; while (opt = arr.shift()) {
      if (typeof opt == 'object' && !Array.isArray(opt) && opt !== null) {
        Object.keys(opt).forEach( key => self[key] = opt[key] );
        continue;
      }
      if (typeof opt == 'string') { this[_default] = opt; continue }
    }
  }
}

class States extends Set
{
  constructor(...arr) {
    debug('States.constructor:',...arr);
    super(...arr);
  }
}

function createTransitions(obj) {
  debug('transitions:',obj);
  return new Transitions(obj);
}
*/

function createSet(...states) {
  states.forEach( s => { Assert(typeof s == 'string') });
  return new Set(states);
}

module.exports = {
  createFsm,
  //createTransitions,
  createSet,
  FiniteStateMachine,
  //Transitions,
  //States,
};
