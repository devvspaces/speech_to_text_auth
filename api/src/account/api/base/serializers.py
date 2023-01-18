from account.models import Profile, User
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from utils.base.validators import validate_special_char, validate_phone


class JWTTokenResponseSerializer(serializers.Serializer):
    refresh = serializers.CharField(
        help_text=f"Refresh token will be used to generate new \
access token every {settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']} minutes ")
    access = serializers.CharField(
        help_text='Used in headers to authenticate users')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    fullname = serializers.CharField(
        required=True, validators=[validate_special_char],
        source='profile.fullname'
    )
    phone = serializers.CharField(
        required=True, validators=[validate_phone],
        source='profile.phone'
    )
    sex = serializers.ChoiceField(
        choices=Profile.SEX,
        source='profile.sex'
    )
    country = serializers.CharField(
        required=True,
        source='profile.country')

    class Meta:
        model = User
        fields = ('password', 'email', 'fullname', 'phone', 'sex', 'country')

    def create(self, validated_data: dict):
        """Create user and profile

        Args:
            validated_data (dict): validated data

        Returns:
            User: User instance just created
        """
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = User.objects.create_user(email=email, password=password)

        # Get the profile and update the first and last names
        profile: Profile = user.profile
        profile_data = validated_data.get('profile')
        profile.fullname = profile_data.get("fullname")
        profile.sex = profile_data.get('sex')
        profile.phone = profile_data.get('phone')
        profile.country = profile_data.get('country')
        profile.save()

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        """
        Validate the user email and password

        Args:
            attrs (dict): values passed to the serializer

        Raises:
            serializers.ValidationError: if email and password does not match

        Returns:
            dict: cleaned data
        """
        email = attrs['email']
        password = attrs['password']

        try:
            user: User = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": 'Please provide a valid email and password'})

        if not user.check_password(password):
            raise serializers.ValidationError(
                {"email": 'Please provide a valid email and password'})

        if not user.active:
            raise serializers.ValidationError(
                {"email": 'Account is not active'})

        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'profile'
        ]


class TokenGenerateResponseSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()


class RegisterResponseSerializer(serializers.Serializer):
    user = UserSerializer()
    token = TokenGenerateResponseSerializer()


class LoginResponseSerializer200(serializers.Serializer):
    user = UserSerializer()
    tokens = JWTTokenResponseSerializer()
