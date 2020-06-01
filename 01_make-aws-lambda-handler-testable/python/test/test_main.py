import sys
from unittest import mock


@mock.patch("src.services.bootstrap", autospec=True)
@mock.patch.dict("os.environ", {"COST_CENTER": "a1b2c3"})
def test__handler__success(bootstrap):
    try:
        # clean up modules cache
        del sys.modules["src.main"]
    except KeyError:
        pass

    bootstrap.return_value = lambda event, context: event

    from src.main import handler

    assert handler == bootstrap.return_value, "handler mismatch"

    bootstrap.assert_called_once_with(cost_center="a1b2c3")


@mock.patch("src.services.bootstrap", autospec=True)
@mock.patch.dict("os.environ", clear=True)
def test__handler__missing_envvar(bootstrap):
    try:
        # clean up modules cache
        del sys.modules["src.main"]
    except KeyError:
        pass

    bootstrap.return_value = lambda event, context: event

    from src.main import handler

    assert handler == bootstrap.return_value, "handler mismatch"

    bootstrap.assert_called_once_with(cost_center=None)
