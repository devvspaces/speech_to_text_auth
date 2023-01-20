import base64
import io

import speech_recognition as sr
from account.models import User
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from utils.base.general import get_tokens_for_user

from . import serializers


class TokenRefreshAPIView(APIView):
    serializer_class = TokenRefreshSerializer

    @swagger_auto_schema(
        request_body=TokenRefreshSerializer,
        responses={200: TokenRefreshSerializer}
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class LoginAPIView(APIView):
    serializer_class = serializers.LoginSerializer

    @swagger_auto_schema(
        request_body=serializers.LoginSerializer,
        responses={
            200: serializers.LoginResponseSerializer200,
        }
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')

        user = User.objects.get(email=email)

        # Serialize User data
        user_serializer = serializers.UserSerializer(user)
        response_data = {
            'tokens': get_tokens_for_user(user),
            'user': user_serializer.data
        }
        return Response(data=response_data)


class RegisterAPIView(APIView):
    permission_classes = []
    serializer_class = serializers.RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        response_data = {
            'tokens': get_tokens_for_user(user),
            'user': serializer.data
        }
        return Response(
            data=response_data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=serializers.RegisterSerializer,
        responses={201: serializers.RegisterResponseSerializer}
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class UserAPIView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return User.objects.get(id=self.request.user.id)


class SpeechToTextView(APIView):

    @swagger_auto_schema(
        request_body=serializers.SpeechBody,
    )
    def post(self, request, *args, **kwargs):
        """
        Convert speech to text, using Google Speech Recognition API
        Accepts a base64 encoded string of audio data

        Returns:
            Response: Response object with text
        """
        try:
            record: str = self.request.data.get('record')
            decoded_b64 = base64.b64decode(record)

            # Convert decoded_b64 to in-memory bytes buffer
            r = sr.Recognizer()
            with sr.AudioFile(io.BytesIO(decoded_b64)) as source:
                # listen for the data (load audio to memory)
                audio_data = r.record(source)
                # recognize (convert from speech to text)
                text = r.recognize_google(audio_data)

            return Response(data={'text': text})
        except Exception as e:
            print(e)
            return Response(
                data={'message': "Error converting speech to text"},
                status=status.HTTP_400_BAD_REQUEST)
