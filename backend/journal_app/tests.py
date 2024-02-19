from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import JournalEntry, JournalEntryContent
from .serializers import JournalEntrySerializer

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

class JournalEntryAPITests(TestCase):
    def setUp(self):
        # Create a test user
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.user_two = User.objects.create_user(username='testuser2', password='testpassword')

        # Create some journal entries for the test user
        self.entry1 = JournalEntry.objects.create(user=self.user)
        self.entry2 = JournalEntry.objects.create(user=self.user)

        # Create entry content for the test entries
        self.content1 = JournalEntryContent.objects.create(entry_id=self.entry1, user=self.user, content='Test Content 1')
        self.content2 = JournalEntryContent.objects.create(entry_id=self.entry2, user=self.user, content='Test Content 2')
    
    def test_get_journal_entries_by_user(self):
        url = f'/entries/{self.user.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure the response data matches the expected serialized data without 'content' field
        expected_data = JournalEntrySerializer([self.entry1, self.entry2], many=True).data

        self.assertEqual(response.data, expected_data)
    
    def test_create_entries(self):
        data = {
            'user': self.user.id,
            'title': 'Journal Title',
            'content': 'Content'
        }

        data_no_content = {
            'user': self.user.id,
        }

        self.client.login(username='testuser', password='testpassword')
        response = self.client.post('/entries/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['entry_data']['title'], data['title'])
        self.assertEqual(response.data['entry_data']['id'], response.data['content_data']['entry_id'])

        response_no_content = self.client.post('/entries/', data_no_content, format='json')
        self.assertEqual(response_no_content.status_code, status.HTTP_400_BAD_REQUEST)

        self.client.logout()
        # User is logged out and should have a permission error.
        logged_out_response = self.client.post('/entries/', data, format='json')
        self.assertEqual(logged_out_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_journal_entry(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.delete(f'/api/entries/{self.entry2.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(JournalEntry.objects.filter(id=self.entry2.id).exists())
        self.assertFalse(JournalEntry.objects.filter(id=self.content2.id).exists())
        self.assertTrue(JournalEntry.objects.filter(id=self.entry1.id).exists())
        self.assertTrue(JournalEntry.objects.filter(id=self.content1.id).exists())
    
    def test_get_journal_entry(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(f'/api/entries/{self.entry1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.entry1.id)
    
    def test_update_journal_entry(self):
        self.client.login(username='testuser', password='testpassword')
        data = {
            'title': 'New Journal Title',
            'user': self.user_two.id,
            'content': 'hello'
        }
        response = self.client.put(f'/api/entries/{self.entry1.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.entry1.refresh_from_db()
        self.assertEqual(self.entry1.title, data['title'])

    def test_partial_update_journal_entry(self):
        self.client.login(username='testuser', password='testpassword')
        data = {'title': 'Updated Title'}
        response = self.client.patch(f'/api/entries/{self.entry1.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.entry1.refresh_from_db()
        self.assertEqual(self.entry1.title, data['title'])
    
    def test_get_journal_entry_content(self):
        
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(f'/api/entries/{self.entry1.id}/content/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.content1.id)
        self.assertEqual(response.data['entry_id'], self.entry1.id)
        self.assertEqual(response.data['content'], self.content1.content)

    def test_journal_entry_content_update(self):
        
        self.client.login(username='testuser', password='testpassword')
        data = {
            'user': self.user.id,
            'content': 'Updated Content'
        }
        response = self.client.put(f'/api/entries/{self.entry1.id}/content/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.content1.refresh_from_db()
        self.assertEqual(self.content1.content, 'Updated Content')

    def test_journal_entry_content_partial_update(self):
        self.client.login(username='testuser', password='testpassword')
        data = {'content': 'Updated Content'}
        response = self.client.patch(f'/api/entries/{self.entry2.id}/content/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.content2.refresh_from_db()
        self.assertEqual(self.content2.content, data['content'])