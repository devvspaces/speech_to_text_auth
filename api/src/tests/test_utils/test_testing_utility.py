from utils.base.testing_utility import BaseTestHelper
from rest_framework import serializers
import pytest


def test_helper():
    helper = BaseTestHelper()

    class TestSerializer(serializers.Serializer):
        name = serializers.CharField()
        age = serializers.IntegerField()

        class Meta:
            fields = ('name', 'age',)

    data = {
        'name': 'John Doe',
        'age': 20
    }

    helper.validate_serializer_data(TestSerializer(data=data), data)

    data = {
        'name': 'John Doe',
        'age': 20,
    }
    helper.validate_serializer_data(
        TestSerializer(data=data), data, excludes=['age'])

    data = {
        'name': 'John Doe',
    }
    with pytest.raises(AssertionError):
        helper.validate_serializer_data(TestSerializer(data=data), data)
