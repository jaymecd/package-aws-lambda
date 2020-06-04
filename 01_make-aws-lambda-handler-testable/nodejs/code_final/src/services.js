const AWS = require('aws-sdk')

exports.bootstrap = function (cost_center) {
    return exports.handler_factory(cost_center);
}

exports.handler_factory = function (cost_center) {
    if (!cost_center) {
        throw new Error("expecting cost center ID")
    }

    const client = new AWS.Lambda();

    return async function (event, context) {
        if (!event.arn) {
            throw new Error("expecting 'arn' key")
        }

        await client.tagResource({
            Resource: event.arn,
            Tags: {
                CostCenter: cost_center
            }
        }).promise()

        response = await client.listTags({
            Resource: event.arn
        }).promise()

        return response.Tags
    }
}
