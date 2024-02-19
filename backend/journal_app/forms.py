from django import forms 
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import JournalEntry

# Password2 is the verification for password1.
class SignupForm(UserCreationForm):
    email = forms.EmailField()
    class Meta:
        model = User 
        fields = ['username', 'email', 'password1', 'password2']

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
