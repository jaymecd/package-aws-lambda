const services = require('../src/services')

afterEach(() => {
  jest.clearAllMocks();
});

const mock_tagResource = jest.fn();
const mock_listTags = jest.fn();

jest.mock('aws-sdk', () => {
  return {
    Lambda: jest.fn(() => ({
      tagResource: mock_tagResource,
      listTags: mock_listTags,
    }))
  };
});

const handler_factory = jest.spyOn(services, 'handler_factory');

describe('bootstrap', () => {
  test('success', async () => {
    const expected_handler = (event, context) => { }
    handler_factory.mockReturnValueOnce(expected_handler);

    const handler = services.bootstrap('a1b2c3')

    expect(handler).toStrictEqual(expected_handler);
  })

  test('error', async () => {
    handler_factory.mockImplementationOnce(() => {
      throw new Error('error happened')
    });

    expect(() => {
      services.bootstrap('a1b2c3')
    }).toThrowError('error happened')
  })
});

describe('handler_factory', () => {
  test('success', async () => {
    mock_tagResource.mockImplementation(() => {
      return {
        promise: jest.fn().mockResolvedValueOnce(),
      };
    });

    mock_listTags.mockImplementation(() => {
      return {
        promise: jest.fn().mockResolvedValueOnce({ Tags: { CostCenter: "a1b2c3", Stage: "dev" } }),
      };
    });

    const handler = services.handler_factory('a1b2c3')

    const event = {
      arn: "arn:aws:lambda:eu-west-1:222222222:function:tag-me"
    }

    const response = await handler(event, null);

    expect(response).toStrictEqual({ CostCenter: "a1b2c3", Stage: "dev" });

    expect(mock_tagResource).toHaveBeenCalledWith({
      Resource: "arn:aws:lambda:eu-west-1:222222222:function:tag-me",
      Tags: {
        CostCenter: "a1b2c3"
      }
    })

    expect(mock_listTags).toHaveBeenCalledWith({
      Resource: "arn:aws:lambda:eu-west-1:222222222:function:tag-me",
    });
  });

  test('empty_param', async () => {
    expect(() => {
      services.handler_factory(undefined)
    }).toThrowError('expecting cost center ID')
  });

  test('invalid_payload', async () => {
    const handler = services.handler_factory('a1b2c3')

    const event = {
      invalid: "payload"
    }

    await expect(handler(event, null)).rejects.toThrowError("expecting 'arn' key")

    expect(mock_tagResource).not.toHaveBeenCalled()
    expect(mock_listTags).not.toHaveBeenCalled()
  })
});
