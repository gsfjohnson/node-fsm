
const Assert = require('assert');

const FSM = require('..');

describe('FiniteStateMachine', () =>
{
  let INIT = 'INIT';
  let ACTION = 'ACTION';
  let FINISHED = 'FINISHED';
  let fsm;
  let states;
  let transitions;

  it('transitions = new Map()', () =>
  {
    let res = new Map();
    Assert(res instanceof Map);
    transitions = res;
  });

  it('states = createSet(ACTION) should return Set([ACTION])', () =>
  {
    let res = FSM.createSet(ACTION);
    Assert(res instanceof Set);
    Assert(res.has(ACTION));
    states = res;
  });

  it('transitions.set( INIT, states ) should return true', () =>
  {
    let res = transitions.set(INIT, states );
    Assert(res);
  });

  it('transitions.set( ACTION, createSet(FINISHED) ) should return true', () =>
  {
    //let arr = [
    //  [ INIT, new Set([ACTION]) ],
    //  [ ACTION, new Set([FINISHED]) ],
    //  [ FINISHED, new Set([INIT]) ],
    //];
    let res = transitions.set(ACTION, FSM.createSet(FINISHED) );
    Assert(res);
  });

  it('fsm = createFsm(transitions,INIT) should return FiniteStateMachine{}', () =>
  {
    let res = FSM.createFsm(transitions,INIT);
    Assert(res instanceof FSM.FiniteStateMachine);
    fsm = res;
    //console.log(fsm)
  });

  it('fsm.once(ACTION) should fire when fsm.next(ACTION) called', function()
  {
    if (!fsm) this.skip();
    let success;
    fsm.once(ACTION, () => { success = true });
    fsm.next(ACTION);
    Assert(success);
  });

  it('fsm.next(INIT) should throw: /Next state/', function()
  {
    if (!fsm) this.skip();
    Assert.throws( () => fsm.next(INIT), /Next state/ );
  });

  it('fsm.next(FINISHED) should return true', function()
  {
    if (!fsm) this.skip();
    let result = fsm.next(FINISHED);
    Assert(result);
  });

  it('fsm.next(INIT) should throw: /does not exist/', function()
  {
    if (!fsm) this.skip();
    Assert.throws( () => fsm.next(INIT), /does not exist/ );
  });

});
