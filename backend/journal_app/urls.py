from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('api/user/', views.CreateUserAPIView.as_view(), name='api-create-user'),
    path('api/user/<int:user_id>/', views.GetUserAPIView.as_view(), name='api-get-user'),
    path('api/current_user/', views.CurrentUserAPIView.as_view(), name='api-current-user'),
    path('api/login/', views.LoginAPIView.as_view(), name='login_api'),
    path('api/logout/', views.LogoutAPIView.as_view(), name='logout_api'),
    path('entries/<int:user_id>/', views.JournalEntriesByUserAPIView.as_view(), name='journal_entries_by_user'),
    path('entries/', views.CreateJournalEntryAPIView.as_view(), name='create_journal_entry'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.user_signup, name='signup'),
    path('logout/', views.user_logout, name='logout'),
]