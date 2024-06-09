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
