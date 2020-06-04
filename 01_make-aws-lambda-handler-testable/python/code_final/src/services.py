from typing import Callable

import boto3


def bootstrap(cost_center: str) -> Callable[[dict, object], dict]:
    session = boto3.Session()

    return handler_factory(session, cost_center)


def handler_factory(
    session: boto3.Session, cost_center: str
) -> Callable[[dict, object], dict]:
    assert cost_center, "expecting cost center ID"

    lambda_client = session.client("lambda")

    def handler(event: dict, context: object) -> dict:
        assert "arn" in event, "expecting 'arn' key"

        lambda_client.tag_resource(
            Resource=event["arn"], Tags={"CostCenter": cost_center},
        )

        response = lambda_client.list_tags(Resource=event["arn"],)

        return response["Tags"]

    return handler
