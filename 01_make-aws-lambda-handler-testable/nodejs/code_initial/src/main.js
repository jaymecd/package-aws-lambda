const AWS = require('aws-sdk')

const cost_center = process.env.COST_CENTER;
const client = new AWS.Lambda();

exports.handler = async function (event, context) {
    if (!cost_center) {
        throw new Error("expecting cost center ID")
    }

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
