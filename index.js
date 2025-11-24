
const Assert = require('assert');
const EventEmitter = require('node:events');

// debug if appropriate
let debug; try { debug = require('debug')('fsm'); }
catch (e) { debug = function(){}; } // empty stub

const _state = Symbol('state');
const _map = Symbol('next');
const _previous = Symbol('previous');
const _emitter = Symbol('emitter');
const _emit = Symbol('emit');
const _id = Symbol('id');

const isSet = s => s instanceof Set;
const isMap = m => m instanceof Map;
const isString = s => typeof s == 'string';
const isObject = o => typeof o == 'object' && o !== null && !Array.isArray(o);
const rebug = (id,...a) => {
  if (isString(id)) {
    let colored = "\x1b[90m"+id+"\x1b[0m";
    debug(colored,...a);
    return;
  }
  debug(...a)
};

/**
 * Finite state machine
 */
class FiniteStateMachine
{
  /**
   * Constructor
   * @param {Map} next State map.
   * @param {String} start Initial state.
   */
  constructor(...arr)
  {
    const options = parseConstructorParameters(...arr);

    this[_state] = options.start;
    this[_previous] = null;
    this[_map] = options.next;
    this[_id] = options.id || null;
    this[_emitter] = new EventEmitter();

    rebug(this.id,'starting',options);
  }

  get id() { return this[_id] }

  get state() { return this[_state] }

  get previous() { return this[_previous] }

  next(state,...arr)
  {
    rebug(this.id,'--->',state);

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

    this[_emit](state,...arr);

    return true;
  }

  /* emitter methods */
  on(state,cb) { this[_emitter].on(state,cb) }
  once(state,cb) { this[_emitter].once(state,cb) }
  off(state,cb) { this[_emitter].off(state,cb) }

  /* private emit */
  [_emit](state,...arr) {
    //rebug(this.id,'emit',state);
    this[_emitter].emit(state,...arr);
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

function parseConstructorParameters(...arr)
{
  let options = { start: null }; // default
  arr.forEach( (el) => {
    if (isMap(el)) options.next = el;
    else if (isString(el) || el === null) options.start = el;
    else if (isObject(el)) Object.assign(options,el);
    else throw new TypeError('invalid parameter: '+ el);
  });
  if (!isMap(options.next)) throw new TypeError('parameter `next` must be Map{}');
  if (!isString(options.start) && start !== null) throw new TypeError('parameter `start` must be a String or null or not defined');
  if (options.id && !isString(options.id)) throw new TypeError('parameter `id` must be string or not defined');
  return options;
}

function createSet(...states) {
  states.forEach( s => { Assert(typeof s == 'string') });
  return new Set(states);
}

function isFSM(val) {
  return (val instanceof FiniteStateMachine) ? true : false;
}

module.exports = {
  createFsm,
  //createTransitions,
  createSet,
  FiniteStateMachine,
  //Transitions,
  //States,
  isFSM,
  is: isFSM,
};
