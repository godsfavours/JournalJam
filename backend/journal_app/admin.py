from django.contrib import admin
from .models import JournalEntry, JournalEntryContent

class JournalAdmin(admin.ModelAdmin):
    list_display = ('user', 'id', 'last_updated', 'title')

class JournalContentAdmin(admin.ModelAdmin):
    list_display = ('id', 'entry', 'user', 'content', 'last_updated')

# Register your models here.

admin.site.register(JournalEntry, JournalAdmin)
admin.site.register(JournalEntryContent, JournalAdmin)

