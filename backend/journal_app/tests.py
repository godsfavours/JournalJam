from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

# Create your tests here.
class SignupLoginAPITests(TestCase):
    def setUp(self):
        # Create a test user
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
    
    def test_create_user_api(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'xYGat7yrnw6372',
            'password2': 'xYGat7yrnw6372'
        }
        response = self.client.post('/api/user/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_user_api_bad_passwords(self):
        data = {
            'username': 'newuser2',
            'email': 'newuser2@example.com',
            'password1': 'xYGat7yrnw6372',
            # different passwords
            'password2': 'incorrect'
        }
        response = self.client.post('/api/user/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_user_api_user_exists(self):
        response = self.client.get(f'/api/user/{self.user.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.user.id)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)
    
    def test_get_user_api_nonexistent_user(self):
        response = self.client.get(f'/api/user/{self.user.id + 1}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_current_user_api(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get('/api/current_user/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.user.id)
        self.assertEqual(response.data['username'], 'testuser')
        self.client.post('/api/logout/')
        response = self.client.get('/api/current_user/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_login_api(self):
        # Test successful login
        response = self.client.post('/api/login/', {'username': 'testuser', 'password': 'testpassword'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test unsuccessful login
        response = self.client.post('/api/login/', {'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_api(self):
        # Log in the test user
        self.client.login(username='testuser', password='testpassword')

        # Test successful logout
        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)