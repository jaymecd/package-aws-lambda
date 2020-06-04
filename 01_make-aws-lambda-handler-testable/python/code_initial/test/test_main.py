import sys
from unittest import mock
import pytest


@mock.patch("boto3.client", autospec=True)
@mock.patch.dict("os.environ", {"COST_CENTER": "a1b2c3"})
def test__handler__success(client_fn):
    try:
        # clean up modules cache
        del sys.modules["src.main"]
    except KeyError:
        pass

    client = client_fn.return_value

    import src.main

    client.list_tags.return_value = {"Tags": {"CostCenter": "a1b2c3", "Stage": "dev"}}
    event = {"arn": "arn:aws:lambda:eu-west-1:222222222:function:tag-me"}
    context = object()

    result = src.main.handler(event, context)

    client_fn.assert_called_once_with("lambda")

    assert client.list_tags.return_value["Tags"] == result

    client.tag_resource.assert_called_once_with(
        Resource=event["arn"], Tags={"CostCenter": "a1b2c3"},
    )

    client.list_tags.assert_called_once_with(Resource=event["arn"],)


@mock.patch("boto3.client", autospec=True)
@mock.patch.dict("os.environ", clear=True)
def test__handler__missing_envvar(client_fn):
    try:
        # clean up modules cache
        del sys.modules["src.main"]
    except KeyError:
        pass

    client = client_fn.return_value

    with pytest.raises(KeyError) as excinfo:
        import src.main

    assert "'COST_CENTER'" == str(excinfo.value)


@mock.patch("boto3.client", autospec=True)
@mock.patch.dict("os.environ", {"COST_CENTER": "a1b2c3"})
def test__handler__invalid_payload(client_fn):
    try:
        # clean up modules cache
        del sys.modules["src.main"]
    except KeyError:
        pass

    client = client_fn.return_value

    import src.main

    client.list_tags.return_value = {"Tags": {"CostCenter": "a1b2c3", "Stage": "dev"}}
    event = {"invalid": "payload"}
    context = object()

    with pytest.raises(KeyError) as excinfo:
        src.main.handler(event, context)

    assert "'arn'" == str(excinfo.value)

    client_fn.assert_called_once_with("lambda")

    client.tag_resource.assert_not_called()
    client.list_tags.assert_not_called()
