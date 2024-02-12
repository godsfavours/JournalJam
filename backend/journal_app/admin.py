from django.contrib import admin
from .models import JournalEntry

class JournalAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'content', 'created_at')

# Register your models here.

admin.site.register(JournalEntry, JournalAdmin)

