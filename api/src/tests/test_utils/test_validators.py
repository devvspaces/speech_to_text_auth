from utils.base.validators import validate_special_char, validate_phone
from rest_framework.serializers import ValidationError
import pytest


@pytest.mark.parametrize(
    'value, expected',
    [
        ('John', None),
        ('John Doe', None),
        ('John@Doe', True),
        ('John Doe@', True),
        ('John Doe@123', True),
    ]
)
def test_validate_special_char(value, expected):
    if not expected:
        assert validate_special_char(value) is None
    else:
        with pytest.raises(ValidationError):
            validate_special_char(value)


@pytest.mark.parametrize(
    'value, expected',
    [
        ('+2348033223423', False),
        ('12345443323443', True),
        ('1234', True),
        ('+1234', True),
    ]
)
def test_validate_phone(value, expected):
    if not expected:
        assert validate_phone(value) is None
    else:
        with pytest.raises(ValidationError):
            validate_phone(value)
