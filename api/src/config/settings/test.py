# flake8: noqa

from .base import *

SECRET_KEY = "fake-key"

INSTALLED_APPS += [
    "tests"
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
}
