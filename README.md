# Finite State Machine

A simple Finite State Machine (FSM) implementation for Node.js, built on top of the `EventEmitter` class. It allows defining state transitions via a Map and provides methods to query the current state, previous state, and transition to new states.

## Installation

To use this module in your project, copy `index.js` into your codebase or install it via npm if published.

```bash
npm install your-fsm-package-name
```

## Usage

### Creating a State Transition Map

The FSM uses a `Map` where keys are current states (strings) and values are `Set` instances of allowed next states.

```javascript
const { createFsm } = require('./index');

// Define transitions: from 'idle' you can go to 'running' or 'stopped'
const transitions = new Map([
  ['idle', new Set(['running', 'stopped'])],
  ['running', new Set(['paused', 'stopped'])],
  ['paused', new Set(['running', 'stopped'])],
  ['stopped', new Set(['idle'])]
]);

// Create FSM with initial state 'idle'
const fsm = createFsm(transitions, 'idle');

console.log(fsm.state); // 'idle'
console.log(fsm.previous); // null
```

### Transitioning States

Use the `next(state)` method to transition to a new state. It emits an event with the new state name.

```javascript
fsm.on('running', () => console.log('Entered running state'));
fsm.on('stopped', () => console.log('Entered stopped state'));

fsm.next('running'); // Emits 'running', state becomes 'running', previous becomes 'idle'
fsm.next('stopped'); // Emits 'stopped', state becomes 'stopped', previous becomes 'running'
```

### Error Handling

- Throws `TypeError` if invalid types are provided (e.g., non-Map for transitions).
- Throws `Error` if transitioning to an invalid state or from a state not in the map.

## API

### FiniteStateMachine Class

- `constructor(next: Map<string, Set<string>>, start: string | null)`: Initializes the FSM.
- `get state()`: Returns the current state.
- `get previous()`: Returns the previous state.
- `next(state: string): boolean`: Transitions to the specified state and emits an event.

### createFsm Function

- `createFsm(next: Map<string, Set<string>>, start?: string | null): FiniteStateMachine`: Factory function to create an FSM instance.

## License

This module is released under the MIT License.