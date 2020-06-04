const bootstrap = jest.fn();

jest.doMock('../src/services', () => {
  return {
    bootstrap: bootstrap
  };
})

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('handler', () => {

  test('success', async () => {
    process.env.COST_CENTER = 'a1b2c3';

    handler = (event, context) => { };
    bootstrap.mockReturnValue(handler);

    const main = require('../src/main')

    expect(main.handler).toStrictEqual(handler);
    expect(bootstrap).toHaveBeenCalledWith("a1b2c3")
  })

  test('missing_envvar', async () => {
    delete process.env.COST_CENTER;

    handler = (event, context) => { };
    bootstrap.mockReturnValue(handler);

    const main = require('../src/main')

    expect(main.handler).toStrictEqual(handler);
    expect(bootstrap).toHaveBeenCalledWith(undefined)
  })
});
