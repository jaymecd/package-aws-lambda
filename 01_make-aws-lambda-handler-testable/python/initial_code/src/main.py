import boto3
import os

cost_center = os.environ["COST_CENTER"]
client = boto3.client("lambda")


def handler(event: dict, context: object) -> dict:
    assert cost_center, "expecting cost center ID"

    client.tag_resource(
        Resource=event["arn"], Tags={"CostCenter": cost_center},
    )

    response = client.list_tags(Resource=event["arn"],)

    return response["Tags"]
