import pytest
from model_bakery import baker

from account.api.base.serializers import LoginSerializer, RegisterSerializer
from account.models import User
from utils.base.testing_utility import BaseTestHelper

pytestmark = [
    pytest.mark.django_db,
]


class TestLoginSerializer:
    def test_success(self):
        user = baker.make(
            User,
            active=True
        )
        password = 'test'
        user.set_password(password)
        user.save()

        serializer = LoginSerializer(data={
            'email': user.email,
            'password': password
        })
        assert serializer.is_valid()

    def test_validation_errors(self):
        user = baker.make(
            User,
            active=True
        )
        password = 'test'
        user.set_password(password)
        user.save()

        serializer = LoginSerializer(data={
            'password': password,
        })
        assert not serializer.is_valid()

        serializer = LoginSerializer(data={
            'email': user.email,
        })
        assert not serializer.is_valid()

        # test with inactive user
        user.active = False
        user.save()
        serializer = LoginSerializer(data={
            'email': user.email,
            'password': password
        })
        assert not serializer.is_valid()

        # user does not exist
        serializer = LoginSerializer(data={
            'email': 'fake@test.com',
            'password': password
        })
        assert not serializer.is_valid()

        # test with invalid password
        serializer = LoginSerializer(data={
            'email': user.email,
            'password': 'test1234'
        })
        assert not serializer.is_valid()


class TestRegisterSerializer(BaseTestHelper):
    def test_success(self):
        password = 'hardPassword@1234'
        input_data = {
            'email': 'test_merchant@gmail.com',
            'phone': '+2348123456789',
            'password': password,
            'password2': password,
            'fullname': 'John',
            'sex': 'M',
            'country': 'Test'
        }
        serializer = RegisterSerializer(data=input_data)
        assert serializer.is_valid()
        serializer.save()
        self.validate_serializer_data(
            serializer, serializer.data, ['id', 'password', 'password2', 'otp']
        )
