from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

# Create your tests here.
class APITests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_login_api(self):
        client = APIClient()

        # Test successful login
        response = client.post('/api/login/', {'username': 'testuser', 'password': 'testpassword'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test unsuccessful login
        response = client.post('/api/login/', {'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_api(self):
        client = APIClient()

        # Log in the test user
        client.login(username='testuser', password='testpassword')

        # Test successful logout
        response = client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)