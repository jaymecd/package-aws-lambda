from unittest import mock

import pytest

from src import services


@mock.patch("src.services.handler_factory", autospec=True)
@mock.patch("src.services.boto3.Session", autospec=True)
def test__bootstrap__success(Session, handler_factory):
    session = Session.return_value
    handler_factory.return_value = lambda event, context: event

    handler = services.bootstrap(cost_center="a1b2c3")

    assert handler == handler_factory.return_value

    handler_factory.assert_called_once_with(session, "a1b2c3")
    Session.assert_called_once()


@mock.patch("src.services.handler_factory", autospec=True)
@mock.patch("src.services.boto3.Session", autospec=True)
def test__bootstrap__error(Session, handler_factory):
    session = Session.return_value
    handler_factory.side_effect = RuntimeError("error happened")

    with pytest.raises(RuntimeError) as excinfo:
        services.bootstrap(cost_center="a1b2c3")

    assert "error happened" == str(excinfo.value)

    handler_factory.assert_called_once_with(session, "a1b2c3")
    Session.assert_called_once()


@mock.patch("src.services.boto3.Session", autospec=True)
def test__handler_factory__success(Session):
    session = Session.return_value

    lambda_client = session.client.return_value
    lambda_client.list_tags.return_value = {
        "Tags": {"Stage": "dev", "CostCenter": "a1b2c3"}
    }

    handler = services.handler_factory(session, "a1b2c3")

    assert callable(handler)

    event = {"arn": "arn:aws:lambda:eu-west-1:222222222:function:tag-me"}
    context = object()

    result = handler(event, context)

    assert lambda_client.list_tags.return_value["Tags"] == result

    session.client.assert_called_once_with("lambda")

    lambda_client.tag_resource.assert_called_once_with(
        Resource=event["arn"], Tags={"CostCenter": "a1b2c3"},
    )


@mock.patch("src.services.boto3.Session", autospec=True)
def test__handler_factory__empty_param(Session):
    session = Session.return_value

    with pytest.raises(AssertionError) as excinfo:
        services.handler_factory(session, "")

    assert "expecting cost center ID" == str(excinfo.value)


@mock.patch("src.services.boto3.Session", autospec=True)
def test__handler_factory__invalid_payload(Session):
    session = Session.return_value

    lambda_client = session.client.return_value

    handler = services.handler_factory(session, "a1b2c3")

    assert callable(handler)

    event = {"invalid": "payload"}
    context = object()

    with pytest.raises(AssertionError) as excinfo:
        handler(event, context)

    assert "expecting 'arn' key" == str(excinfo.value)

    lambda_client.tag_resource.assert_not_called()
    lambda_client.list_tags.assert_not_called()
