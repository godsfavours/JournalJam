from django.db import models
from django.contrib.auth.models import User

# Create your models here.
    
class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    last_updated = models.DateTimeField(auto_now=True)

class JournalEntryContent(models.Model):
    entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)
