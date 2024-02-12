from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.user_signup, name='signup'),
    path('logout/', views.user_logout, name='logout'),
    path('journal_entries/', views.journal_entries, name='journal_entries'),
    path('entry/<int:entry_id>/', views.view_entry, name='view_entry'),
]