from django.shortcuts import render, redirect, get_object_or_404
from .models import JournalEntry, JournalEntryContent
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import UserCreationForm, LoginForm, SignupForm
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserSerializer, JournalEntrySerializer, JournalEntryContentSerializer

# Create your views here.

class JournalEntriesByUserAPIView(APIView):
    def get(self, request, user_id):
        entries = JournalEntry.objects.filter(user=user_id)
        serializer = JournalEntrySerializer(entries, many=True, context={'request': request})
        data = serializer.data
        return Response(data)

class CreateJournalEntryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        entry_serializer = JournalEntrySerializer(data=request.data)
        if entry_serializer.is_valid():
            entry_instance = entry_serializer.save(user=request.user)
            entry_id = entry_instance.id
            request_data = request.data
            request_data['entry_id'] = entry_id
            content_serializer = JournalEntryContentSerializer(data = request_data, context={'entry': entry_instance})
            if content_serializer.is_valid():
                content_serializer.save(user=request.user)
                data = {
                    'entry_data': entry_serializer.data,
                    'content_data': content_serializer.data
                }
                return Response(data, status=status.HTTP_201_CREATED)
            else:
                return Response(content_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(entry_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class JournalEntryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, entry_id):
        entry = JournalEntry.objects.get(pk=entry_id)
        serializer = JournalEntrySerializer(entry)
        return Response(serializer.data)

    def delete(self, request, entry_id):
        entry = JournalEntry.objects.get(pk=entry_id)
        entry_content = JournalEntryContent.objects.filter(entry_id=entry_id, user=request.user).first()

        if entry_content:
            entry_content.delete()

        entry.delete()
        return Response({'detail': 'Journal entry and content deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, entry_id):
        entry = JournalEntry.objects.get(id=entry_id)
        serializer = JournalEntrySerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, entry_id):
        entry = JournalEntry.objects.get(id=entry_id)
        serializer = JournalEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JournalEntryContentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, entry_id):
        try:
            content = JournalEntryContent.objects.get(entry_id=entry_id, user=request.user)
            serializer = JournalEntryContentSerializer(content)
            return Response(serializer.data)
        except JournalEntryContent.DoesNotExist:
            return Response({'detail': 'Journal entry content not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, entry_id):
        try:
            content = JournalEntryContent.objects.get(entry_id=entry_id, user=request.user)
            request_data = request.data
            request_data['entry_id'] = entry_id
            serializer = JournalEntryContentSerializer(content, data=request_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JournalEntryContent.DoesNotExist:
            return Response({'detail': 'Journal entry content not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, entry_id):
        try:
            content = JournalEntryContent.objects.get(entry_id=entry_id, user=request.user)
            serializer = JournalEntryContentSerializer(content, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JournalEntryContent.DoesNotExist:
            return Response({'detail': 'Journal entry content not found'}, status=status.HTTP_404_NOT_FOUND)

class CreateUserAPIView(APIView):
    def post(self, request):
        form = SignupForm(request.data)  # Replace with your actual form or serializer
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            form.save()
            user = authenticate(request, username=username, password=password)

            if user:
                login(request, user)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response({'detail': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'detail': 'Invalid signup data'}, status=status.HTTP_400_BAD_REQUEST)

class GetUserAPIView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class CurrentUserAPIView(APIView):
    def get(self, request):
        user = request.user
        if user and user.id is not None:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'No user is currently logged in'}, status=status.HTTP_404_NOT_FOUND)

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)


def index(request):
  return render(request, 'index.html')

# signup page
def user_signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            form.save()
            user = authenticate(request, username=username, password=password)
            # Have user be authenticated and logged in on successful sign up.
            if user:
                login(request, user)
                return redirect('journal_entries')
    else:
        form = SignupForm()
    return render(request, 'signup.html', {'form': form})

# login page
def user_login(request):
    context_username = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('journal_entries')
            else:
                # Pass username context so the field remains populated on a failed login.
                context_username = username
                # Error message for failed login.
                messages.info(request, 'Username or password is incorrect.')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form, 'username': context_username})

# logout page
def user_logout(request):
    logout(request)
    return redirect('login')

