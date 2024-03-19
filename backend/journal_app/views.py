from django.db.models import Prefetch
from .models import JournalEntry, JournalEntryContent, JournalPrompt
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from .forms import SignupForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserSerializer, JournalEntrySerializer, JournalEntryContentSerializer, JournalPromptSerializer
from .llm import client
from .configs import SYSTEM_PROMPT, JOURNAL_ENTRY_PREPEND, MODEL_ID, MAX_LEN

# Create your views here.

class JournalEntriesByUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # Check if the requested user exists and get the user instance
        user = get_object_or_404(User, pk=user_id)

        # Check if the requesting user has permission to view the requested user's entries
        if request.user != user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to view these journal entries.'},
                            status=status.HTTP_403_FORBIDDEN)

        entries = JournalEntry.objects.filter(user=user)
        serializer = JournalEntrySerializer(entries, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateJournalEntryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        entry_serializer = self.get_serializer(JournalEntrySerializer, request.data)
        if not entry_serializer:
            return Response(entry_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        entry_instance = entry_serializer.save(user=request.user)
        request_data = self.update_request_data_with_entry_id(request.data, entry_instance.id)

        content_serializer = self.get_serializer(JournalEntryContentSerializer, request_data, entry_instance)
        if not content_serializer:
            return Response(content_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prompt_serializer = self.get_serializer(JournalPromptSerializer, request_data, entry_instance)
        if not prompt_serializer:
            return Response(prompt_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'entry_data': entry_serializer.data,
            'content_data': content_serializer.data,
            'prompt_data': prompt_serializer.data
        }
        return Response(data, status=status.HTTP_201_CREATED)

    def get_serializer(self, serializer_class, data, entry_instance=None):
        context = {'entry': entry_instance} if entry_instance else {}
        serializer = serializer_class(data=data, context=context)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return serializer
        else:
            print("errors: ", serializer.errors)
            return None

    def update_request_data_with_entry_id(self, data, entry_id):
        data = data.copy()  # Create a mutable copy of the request data
        data['entry_id'] = entry_id
        return data
        
class JournalEntryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, entry_id):
        entry = JournalEntry.objects.get(pk=entry_id)
        serializer = JournalEntrySerializer(entry)
        return Response(serializer.data)

    def delete(self, request, entry_id):
        entry = JournalEntry.objects.get(pk=entry_id)
        entry_content = JournalEntryContent.objects.filter(entry_id=entry_id, user=request.user).first()

        if entry_content:
            entry_content.delete()

        entry.delete()
        return Response({'detail': 'Journal entry and content deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, entry_id):
        entry = JournalEntry.objects.get(id=entry_id)
        serializer = JournalEntrySerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, entry_id):
        entry = JournalEntry.objects.get(id=entry_id)
        serializer = JournalEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class JournalEntryContentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, entry_id):
        """
        Helper method to get the object and handle object not found error.
        """
        return get_object_or_404(JournalEntryContent, entry_id=entry_id, user=self.request.user)

    def get(self, request, entry_id):
        content = self.get_object(entry_id)
        serializer = JournalEntryContentSerializer(content)
        return Response(serializer.data)

    def update(self, request, entry_id, partial=False):
        """
        Handle update operations for PUT and PATCH methods.
        """
        content = self.get_object(entry_id)
        serializer = JournalEntryContentSerializer(content, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, entry_id):
        return self.update(request, entry_id, partial=False)

    def patch(self, request, entry_id):
        return self.update(request, entry_id, partial=True)
    
    
class JournalPromptAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, entry_id):
        """
        Helper method to retrieve the journal prompt object, ensuring it belongs to the
        request's user. Automatically raises a 404 error if not found.
        """
        return get_object_or_404(JournalPrompt, entry_id=entry_id, user=self.request.user)

    def get(self, request, entry_id):
        prompt = self.get_object(entry_id)
        serializer = JournalPromptSerializer(prompt)
        return Response(serializer.data)

    def update(self, request, entry_id, partial=False):
        """
        A unified method to handle both PUT and PATCH requests.
        """
        prompt = self.get_object(entry_id)
        serializer = JournalPromptSerializer(prompt, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, entry_id):
        return self.update(request, entry_id, partial=False)

    def patch(self, request, entry_id):
        return self.update(request, entry_id, partial=True)
        

class CreateUserAPIView(APIView):
    def post(self, request):
        form = SignupForm(request.data)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')

            # Directly authenticate and log in the newly created user
            auth_user = authenticate(username=username, password=password)
            if auth_user is not None:
                login(request, auth_user)
                return Response({'detail': 'User created successfully.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'detail': 'Authentication failed unexpectedly.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUserAPIView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        

class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
    
    
class LLMJournalEntriesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        entries = JournalEntry.objects.filter(user=user_id).order_by("last_updated")
        entry_serializer = JournalEntrySerializer(entries, many=True, context={'request': request})
        
        content_list, content_len = [], 0

        for serialized_entry in entry_serializer.data[::-1]:
            content = JournalEntryContent.objects.get(entry_id=serialized_entry['id'], user=request.user)
            content_txt: str = JournalEntryContentSerializer(content).data['content']
            if content_len < MAX_LEN and len(content_txt) > 0:
                content_list.append(content_txt)
                content_len += len(content_txt.split())
            if content_len >= MAX_LEN:
                break
        
        prompt_text = JOURNAL_ENTRY_PREPEND + "\n\n".join(content_list)
        
        # Assume 'client' setup to communicate with LLM and handle its response.
        response = self.query_llm(prompt_text)
        prompts = self.process_response(response)
        
        return Response({"prompts": prompts}, status=status.HTTP_200_OK)

    def query_llm(self, prompt_text):
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_text},
        ]
        
        return client.chat.completions.create(
            model=MODEL_ID,
            messages=messages
        )

    def process_response(self, response):
        response_text = response.choices[0].message.content.split('\n')
        return [r[3:] if r[0].isnumeric() else r for r in response_text if len(r) > 4]