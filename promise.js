/*
    Promise state
    A promise is an objectthat must be in one of these states: PENDING, FULFILLED, REJECTED, 
    initially the promise is in a PENDING state.

    A promise can transition from a PENDING state to either 
    a FULFILLED state with a fulfillment value 
    or to a REJECTED state with a rejection reason.

    To make the transition the Promise constructor receives a function called executor, 
    the executor is called immediately with two functions fulfill and reject that when called 
    perform the state transition:
        fulfill(value) - from PENDING to FULFILLED with value, the value is now a property of the promise.
        reject(reason) - from PENDING to REJECTED with reason, the reason is now a property of the promise.
*/

// state constants
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

// promise class
class APromise {
  constructor(executor) {
    // initial state
    this.state = PENDING;

    // the fulfillment value or rejection reason is mapped internally to `value`
    // initially the promise doesn't have a value

    // .then handler queue
    this.queue = [];

    // call the executor immediately
    doResolve(this, executor);
  }

  then(onFulfilled, onRejected) {
    handle(this, { onFulfilled, onRejected });
  }
}

// checks the state of the promise to either:
// - queue it for later use if the promise is PENDING
// - call the handler if the promise is not PENDING
function handle(promise, handler) {
  if (promise.state === PENDING) {
    // queue if PENDING
    promise.queue.push(handler);
  } else {
    // execute immediately
    handleResolved(promise, handler);
  }
}

// call either the onFulfilled or onRejected function
function handleResolved(promise, handler) {
  const cb =
    promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected;
  cb(promise.value);
}

// fulfill with `value`
function fulfill(promise, value) {
  promise.state = FULFILLED;
  promise.value = value;

  // invoke all handlers once state changes
  finale(promise);
}

// reject with `reason`
function reject(promise, reason) {
  promise.state = REJECTED;
  promise.value = reason;

  // invoke all handlers once state changes
  finale(promise);
}

// invoke all the handlers stored in the promise
function finale(promise) {
  const length = promise.queue.length;
  for (let i = 0; i < length; i += 1) {
    handle(promise, promise.queue[i]);
  }
}

// creates the fulfill/reject functions that are arguments of the executor
function doResolve(promise, executor) {
  let called = false;

  function wrapFulfill(value) {
    if (called) {
      return;
    }

    called = true;
    fulfill(promise, value);
  }

  function wrapReject(reason) {
    if (called) {
      return;
    }

    called = true;
    reject(promise, reason);
  }

  try {
    executor(wrapFulfill, wrapReject);
  } catch (err) {
    wrapReject(err);
  }
}

module.exports = APromise;
