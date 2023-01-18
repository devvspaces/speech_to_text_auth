"""
Utilities for projects
"""
from rest_framework_simplejwt.tokens import RefreshToken


def invalid_str(value):
    """A string is invalid if it contains any of the following characters:
    @#$%^&*+=://;?><}{[]()

    Args:
        value (str): The string to check

    Returns:
        bool: True if the string is invalid, False otherwise
    """
    for i in '@#$%^&*+=://;?><}{[]()':
        if i in value:
            return True
    return False


def get_tokens_for_user(user):
    """
    Get the tokens for user
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
