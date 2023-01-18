from typing import Callable, Dict, TypeVar
from unittest import TestCase

import pytest
from rest_framework.test import APIClient

from utils.base.general import get_tokens_for_user


U = TypeVar('U', bound=TestCase)


basic_email = 'test_email@gmail.com'

drf_client = APIClient()

API_CLIENT_METHODS: Dict[str, Callable[..., None]] = {
    'post': drf_client.post,
    'patch': drf_client.patch,
    'put': drf_client.put,
    'delete': drf_client.delete,
    'get': drf_client.get,
}


@pytest.fixture
def test_case():
    return TestCase()


@pytest.fixture
def keyless_base_client():

    def inner(method: str = "post"):

        method = method if method is not None else "post"
        client = API_CLIENT_METHODS[method]

        def child(url: str, data: dict = None, headers: dict = None):
            if headers is None:
                headers = {}

            return client(
                url, data, format='json',
                **headers
            )

        return child

    return inner


@pytest.fixture
def post(keyless_base_client):
    return keyless_base_client()


@pytest.fixture
def get(keyless_base_client):
    return keyless_base_client('get')


@pytest.fixture
def delete(keyless_base_client):
    return keyless_base_client('delete')


@pytest.fixture
def patch(keyless_base_client):
    return keyless_base_client('patch')


@pytest.fixture
def put(keyless_base_client):
    return keyless_base_client('put')


@pytest.fixture
def base_client(keyless_base_client):

    def inner(method=None):

        def child(url: str, data: dict = None, headers: dict = None):

            if headers is None:
                headers = {}

            return keyless_base_client(method)(url, data, headers)

        return child

    return inner


@pytest.fixture
def logged_client(base_client):

    def parent(method="post"):

        def inner(user, url, data=None, headers=None):
            if headers is None:
                headers = {}
            access_token = get_tokens_for_user(user)['access']
            headers['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
            return base_client(method)(url, data, headers)

        return inner

    return parent


@pytest.fixture
def logged_post(logged_client):
    return logged_client()


@pytest.fixture
def logged_get(logged_client):
    return logged_client('get')


@pytest.fixture
def logged_delete(logged_client):
    return logged_client('delete')


@pytest.fixture
def logged_put(logged_client):
    return logged_client('put')


@pytest.fixture
def logged_patch(logged_client):
    return logged_client('patch')


@pytest.fixture
def dummy_request():
    class Request:
        user = None
    return Request()
