import { getConditionsByPath } from "../src/";


describe('getConditionsByPath', () => {
  it('valid path, comparisonResult = true',() => {
    const obj = { hello: {there: {success: "OK"}}}
    const { conditions, comparisonResult } = getConditionsByPath(obj, 'obj.hello.there.success', 'OK');

    expect(conditions)                      .toBeDefined();
    expect(conditions)                      .toEqual({
      obj: true,
      ["obj.hello"]: true,
      ["obj.hello.there"]: true,
      ["obj.hello.there.success"]: true,
    });
    expect(comparisonResult)                .toBe(true);
  });

  it('broken path, comparisonResult = false',() => {
    const obj = { hello: {}}
    const { conditions, comparisonResult } = getConditionsByPath(obj, 'obj.hello.there.success', 'OK');

    expect(conditions)                      .toBeDefined();
    expect(conditions)                      .toEqual({
      obj: true,
      ["obj.hello"]: true,
      ["obj.hello.there"]: false,
      ["obj.hello.there.success"]: false,
    });
    expect(comparisonResult)                .toBe(false);
  });
})