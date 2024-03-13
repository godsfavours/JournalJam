from django.urls import path
from . import views

urlpatterns = [
    path('api/user/', views.CreateUserAPIView.as_view(), name='api-create-user'),
    path('api/user/<int:user_id>/', views.GetUserAPIView.as_view(), name='api-get-user'),
    path('api/current_user/', views.CurrentUserAPIView.as_view(), name='api-current-user'),
    path('api/login/', views.LoginAPIView.as_view(), name='login_api'),
    path('api/logout/', views.LogoutAPIView.as_view(), name='logout_api'),
    path('entries/<int:user_id>/', views.JournalEntriesByUserAPIView.as_view(), name='journal_entries_by_user'),
    path('entries/', views.CreateJournalEntryAPIView.as_view(), name='create_journal_entry'),
    path('api/entries/<int:entry_id>/', views.JournalEntryDetailAPIView.as_view(), name='journal_entry_details'),
    path('api/entries/<int:entry_id>/content/', views.JournalEntryContentDetailAPIView.as_view(), name='journal_entry_content_details'),

    path('api/entries/<int:entry_id>/prompt/', views.JournalPromptAPIView.as_view(), name='journal_entry_prompt'), #get and put
    
    path('llm/entries/<int:user_id>/', views.LLMJournalEntriesAPIView.as_view(), name='llm_entries_by_user'),
]