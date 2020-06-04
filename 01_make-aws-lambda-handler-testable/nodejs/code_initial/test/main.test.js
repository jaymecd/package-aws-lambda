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

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('handler file', () => {

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

    process.env.COST_CENTER = 'a1b2c3';

    const event = {
      arn: "arn:aws:lambda:eu-west-1:222222222:function:tag-me"
    }

    const main = require('../src/main')

    const response = await main.handler(event, null);

    expect(response).toStrictEqual({ CostCenter: "a1b2c3", Stage: "dev" });

    expect(mock_tagResource).toHaveBeenCalledWith({ Resource: "arn:aws:lambda:eu-west-1:222222222:function:tag-me", Tags: { CostCenter: "a1b2c3" } })
    expect(mock_listTags).toHaveBeenCalledWith({ Resource: "arn:aws:lambda:eu-west-1:222222222:function:tag-me" })
  })

  test('missing_envvar', async () => {
    delete process.env.COST_CENTER;

    const event = {
      arn: "arn:aws:lambda:eu-west-1:222222222:function:tag-me"
    }

    const main = require('../src/main')

    await expect(main.handler(event, null)).rejects.toThrow('expecting cost center ID');

    expect(mock_tagResource).not.toHaveBeenCalled()
    expect(mock_listTags).not.toHaveBeenCalled()
  })

  test('invalid_payload', async () => {
    mock_tagResource.mockImplementation(() => {
      return {
        promise: jest.fn().mockResolvedValueOnce(),
      }
    });

    mock_listTags.mockImplementation(() => {
      return {
        promise: jest.fn().mockResolvedValueOnce({ Tags: { CostCenter: "a1b2c3", Stage: "dev" } }),
      };
    });

    process.env.COST_CENTER = 'a1b2c3';

    const event = {
      invalid: "payload"
    }

    const main = require('../src/main')

    await expect(main.handler(event, null)).rejects.toThrow("expecting 'arn' key");

    expect(mock_tagResource).not.toHaveBeenCalled()
    expect(mock_listTags).not.toHaveBeenCalled()
  })
});
