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

    // call the executor immediately
    doResolve(this, executor);
  }

  then(onFulfilled, onRejected) {
    handleResolved(this, onFulfilled, onRejected);
  }
}

// call either the onFulfilled or onRejected function
function handleResolved(promise, onFulfilled, onRejected) {
  const cb = promise.state === FULFILLED ? onFulfilled : onRejected;
  cb(promise.value);
}

// fulfill with `value`
function fulfill(promise, value) {
  promise.state = FULFILLED;
  promise.value = value;
}

// reject with `reason`
function reject(promise, reason) {
  promise.state = REJECTED;
  promise.value = reason;
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

  executor(wrapFulfill, wrapReject);
}

module.exports = APromise;
