const APromise = require("./promise");

describe("Promise Constructor", () => {
  it("receives a executor function when constructed which is called immediately", () => {
    // mock function
    const executor = jest.fn();

    const promise = new APromise(executor);

    // mock function should be called immediately
    expect(executor.mock.calls.length).toBe(1);

    // arguments should be functions
    expect(typeof executor.mock.calls[0][0]).toBe("function");
    expect(typeof executor.mock.calls[0][1]).toBe("function");
  });

  it("is in a PENDING state", () => {
    const executor = jest.fn();
    const promise = new APromise(executor);

    expect(promise.state).toBe("PENDING");
  });

  it("transitions to the FULFILLED state with a `value`", () => {
    const value = "value";
    const promise = new APromise((fulfill, reject) => {
      fulfill(value);
    });

    expect(promise.state).toBe("FULFILLED");
  });

  it("transitions to the REJECTED state with a `reason`", () => {
    const reason = "reason";
    const promise = new APromise((fulfill, reject) => {
      reject(reason);
    });

    expect(promise.state).toBe("REJECTED");
  });
});

describe("Observing state changes", () => {
  it("should have a .then method", () => {
    const promise = new APromise(() => {});

    expect(typeof promise.then).toBe("function");
  });

  it("should call the onFulfilled method when a promise is in a FULFILLED state", () => {
    const value = "value";
    const onFulfilled = jest.fn();

    const promise = new APromise((fulfill, reject) => {
      fulfill(value);
    });
    promise.then(onFulfilled);

    expect(onFulfilled.mock.calls.length).toBe(1);
    expect(onFulfilled.mock.calls[0][0]).toBe(value);
  });

  it("transitions to the REJECTED state with a `reason`", () => {
    const reason = "reason";
    const onRejected = jest.fn();

    const promise = new APromise((fulfill, reject) => {
      reject(reason);
    });
    promise.then(null, onRejected);

    expect(onRejected.mock.calls.length).toBe(1);
    expect(onRejected.mock.calls[0][0]).toBe(reason);
  });
});

describe("One way transition", () => {
  const value = "value";
  const reason = "reason";
  let onFulfilled, onRejected;

  beforeEach(() => {
    onFulfilled = jest.fn();
    onRejected = jest.fn();
  });

  it("when a promise is fulfilled it should not be rejected with another value", () => {
    const promise = new APromise((resolve, reject) => {
      resolve(value);
      reject(reason);
    });
    promise.then(onFulfilled, onRejected);

    expect(onFulfilled.mock.calls.length).toBe(1);
    expect(onFulfilled.mock.calls[0][0]).toBe(value);
    expect(onRejected.mock.calls.length).toBe(0);
    expect(promise.state).toBe("FULFILLED");
  });

  it("when a promise is rejected it should not be fulfilled with another value", () => {
    const promise = new APromise((resolve, reject) => {
      reject(reason);
      resolve(value);
    });
    promise.then(onFulfilled, onRejected);

    expect(onRejected.mock.calls.length).toBe(1);
    expect(onRejected.mock.calls[0][0]).toBe(reason);
    expect(onFulfilled.mock.calls.length).toBe(0);
    expect(promise.state).toBe("REJECTED");
  });
});
