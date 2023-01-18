from django import forms
from django.contrib.auth import password_validation
from utils.base.validators import validate_special_char, validate_phone

from .models import Profile, User


class UserRegisterForm(forms.ModelForm):
    """Form for registering a new user

    Args:
        forms (ModelForm): The form class
    """

    email = forms.EmailField(label="Email address", max_length=60)
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput,
        min_length=8,
        help_text=password_validation.password_validators_help_text_html())
    password2 = forms.CharField(
        label="Confirm password",
        widget=forms.PasswordInput,
        help_text='Must be similar to first password to pass verification')

    fullname = forms.CharField(
        label="Full name",
        max_length=50,
        validators=[validate_special_char])
    sex = forms.ChoiceField(choices=Profile.SEX)
    phone = forms.CharField(
        label="Phone number",
        max_length=20,
        validators=[validate_phone])
    country = forms.CharField(label="Country", max_length=60)

    class Meta:
        model = User
        fields = (
            "email", "fullname", "password",
            "password2", "sex", "phone",
            "country"
        )

    def clean_password(self):
        """Validate the password using the default password validators.

        Returns:
            str: The password if it is valid
        """
        ps1 = self.cleaned_data.get("password")
        password_validation.validate_password(ps1, None)
        return ps1

    def clean_password2(self):
        """Validate the password2 is the same as password1

        Returns:
            str: The password2 if it is valid
        """
        ps1 = self.cleaned_data.get("password")
        ps2 = self.cleaned_data.get("password2")
        if (ps1 and ps2) and (ps1 != ps2):
            raise forms.ValidationError("The passwords does not match")
        return ps2

    def save(self, commit=True):
        """Save the form data to the database

        Args:
            commit (bool, optional): Defaults to True. If True,
            save the data to the database

        Returns:
            User: The user object
        """
        user: User = super(UserRegisterForm, self).save(commit=False)
        user.set_password(self.cleaned_data.get("password"))

        if commit:
            user.save()

            # Profile is already created using the signal
            profile: Profile = user.profile
            profile.fullname = self.cleaned_data.get("fullname")
            profile.sex = self.cleaned_data.get('sex')
            profile.phone = self.cleaned_data.get('phone')
            profile.country = self.cleaned_data.get('country')
            profile.save()

        return user
