from django.shortcuts import render, redirect
from rest_framework import viewsets
from .serializers import JournalSerializer
from .models import Journal
from django.contrib.auth import authenticate, login, logout 
from .forms import UserCreationForm, LoginForm, SignupForm
from django.contrib import messages

# Create your views here.

class JournalView(viewsets.ModelViewSet):
    serializer_class = JournalSerializer
    queryset = Journal.objects.all()
  
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
                return redirect('home')
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
                return redirect('home')
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

