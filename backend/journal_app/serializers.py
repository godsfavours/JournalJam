from django.contrib.auth.models import User
from rest_framework import serializers
from .models import JournalEntry, JournalEntryContent


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'user', 'last_updated', 'title']

class JournalEntryContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntryContent
        fields = ['id', 'entry_id', 'user', 'content', 'last_updated']