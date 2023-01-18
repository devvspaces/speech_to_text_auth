import pytest
from account.models import User
from model_bakery import baker
from utils.base.general import get_tokens_for_user, invalid_str


@pytest.mark.django_db
def test_get_tokens_for_user():
    user = baker.make(User)
    tokens = get_tokens_for_user(user)
    assert tokens['refresh'] is not None
    assert tokens['access'] is not None


@pytest.mark.parametrize(
    'value, expected',
    [
        ('test', False),
        ('test@', True),
        ('', False),
        ('@', True),
    ]
)
def test_invalid_str(value, expected):
    assert invalid_str(value) == expected
