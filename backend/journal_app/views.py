from django.shortcuts import render, redirect, get_object_or_404
from .models import JournalEntry
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import UserCreationForm, LoginForm, SignupForm, JournalEntryForm
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserSerializer

# Create your views here.

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

@login_required(login_url='login')  # Specify the login URL
def journal_entries(request):
    entries = JournalEntry.objects.filter(user=request.user).order_by('-created_at')
    form = JournalEntryForm()

    if request.method == 'POST':
        form = JournalEntryForm(request.POST)
        if form.is_valid():
            entry = form.save(commit=False)
            entry.user = request.user
            entry.save()
            return redirect('journal_entries')

    return render(request, 'journal_entries.html', {'entries': entries, 'form': form})

@login_required(login_url='login')  # Specify the login URL
def view_entry(request, entry_id):
    entry = get_object_or_404(JournalEntry, id=entry_id, user=request.user)

    if request.method == 'POST':
        form = JournalEntryForm(request.POST, instance=entry)
        if form.is_valid():
            form.save()
            # Render the same template with the updated entry information
            return render(request, 'view_entry.html', {'entry': entry, 'form': form})
    else:
        form = JournalEntryForm(instance=entry)

    return render(request, 'view_entry.html', {'entry': entry, 'form': form})
  
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
