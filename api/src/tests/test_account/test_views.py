import pytest
from account.models import User
from django.urls import reverse
from model_bakery import baker
from rest_framework import status
from utils.base.general import get_tokens_for_user
from unittest.mock import patch
from django.conf import settings


@pytest.mark.django_db
class TestTokenRefreshAPIView:

    url = reverse('auth:refresh')

    def test_success(self, client):
        user = baker.make(User)
        refresh = get_tokens_for_user(user)['refresh']
        response = client.post(self.url, {
            'refresh': refresh
        })
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_fail(self, client):
        response = client.post(self.url, {
            'refresh': 'invalid'
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'access' not in response.data


@pytest.mark.django_db
class TestLogin:

    url = reverse('auth:login')

    def test_success(self, client):
        user = baker.make(User)
        user.set_password('password')
        user.save()

        user.profile.fullname = 'Test User'
        user.profile.save()

        response = client.post(self.url, {
            'email': user.email,
            'password': 'password'
        })
        assert response.status_code == status.HTTP_200_OK
        assert 'tokens' in response.data
        assert 'user' in response.data
        assert response.data['user']['profile']['fullname'] == 'Test User'

    def test_fail(self, client):
        response = client.post(self.url, {
            'email': 'invalid',
            'password': 'invalid'
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestRegister:

    url = reverse('auth:register')

    def test_success(self, client):
        password = 'hardPassword@1234'
        data = {
            'email': 'test_merchant@gmail.com',
            'phone': '+2348123456789',
            'password': password,
            'password2': password,
            'fullname': 'John',
            'sex': 'M',
            'country': 'Test'
        }
        response = client.post(self.url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data
        assert 'user' in response.data
        assert response.data['user']['fullname'] == data['fullname']


@pytest.mark.django_db
class TestUserAPIView:

    url = reverse('auth:user')

    def test_success(self, client):
        user = baker.make(User)
        access = get_tokens_for_user(user)['access']
        response = client.get(self.url, **{
            'HTTP_AUTHORIZATION': "Bearer " + access
        })
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestSpeechToTextView:

    url = reverse('auth:speech')

    def test_success(self, client):
        with patch(
            'account.api.base.views.sr.Recognizer.recognize_google',
            return_value="test"
        ):
            with open(settings.BASE_DIR / 'tests/test.txt', "r") as file:
                encode_string = file.read()

            response = client.post(self.url, {
                'record': encode_string
            })
            assert response.status_code == status.HTTP_200_OK
            assert 'text' in response.data

    def test_fail(self, client):
        response = client.post(self.url, {
            'record': 'invalid'
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'message' in response.data
