import pytest
from account.forms import UserRegisterForm


@pytest.mark.django_db
class TestUserRegisterForm:

    def input_data(self):
        password = 'hardPassword@1234'
        return {
            'email': 'test_merchant@gmail.com',
            'phone': '+2348123456789',
            'password': password,
            'password2': password,
            'fullname': 'John',
            'sex': 'M',
            'country': 'Test'
        }

    def test_success(self):
        data = self.input_data()
        form = UserRegisterForm(data)
        assert form.is_valid()
        user = form.save()
        user.check_password(data['password'])
        assert user.profile.id
        assert user.profile.fullname == 'John'

    def test_clean_password_error(self):
        data = self.input_data()
        data['password'] = '1234'
        form = UserRegisterForm(data)
        assert not form.is_valid()
        assert form.errors['password']

    def test_clean_password2_error(self):
        data = self.input_data()
        data['password2'] = '1234'
        form = UserRegisterForm(data)
        assert not form.is_valid()
        assert form.errors['password2']
