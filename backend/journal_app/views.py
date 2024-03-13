from django.shortcuts import render, redirect, get_object_or_404
from .models import JournalEntry, JournalEntryContent, JournalPrompt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import UserCreationForm, LoginForm, SignupForm
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserSerializer, JournalEntrySerializer, JournalEntryContentSerializer, JournalPromptSerializer
from .llm import client
from .configs import SYSTEM_PROMPT, JOURNAL_ENTRY_PREPEND, MODEL_ID

# Create your views here.

class JournalEntriesByUserAPIView(APIView):
    def get(self, request, user_id):
        entries = JournalEntry.objects.filter(user=user_id)
        serializer = JournalEntrySerializer(entries, many=True, context={'request': request})
        data = serializer.data
        return Response(data)

class CreateJournalEntryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        entry_serializer = JournalEntrySerializer(data=request.data)
        if entry_serializer.is_valid():
            entry_instance = entry_serializer.save(user=request.user)
            entry_id = entry_instance.id
            request_data = request.data
            request_data['entry_id'] = entry_id
            # for journal entry content
            content_serializer = JournalEntryContentSerializer(data = request_data, context={'entry': entry_instance})
            if content_serializer.is_valid():
                content_serializer.save(user=request.user)
                data = {
                    'entry_data': entry_serializer.data,
                    'content_data': content_serializer.data
                }

                # for journal prompts
                prompt_serializer = JournalPromptSerializer(data = request_data, context={'entry': entry_instance})
                if prompt_serializer.is_valid():
                    prompt_serializer.save(user=request.user)
                    data = {
                        'entry_data': entry_serializer.data,
                        'content_data': content_serializer.data,
                        'prompt_data': prompt_serializer.data
                    }
                    return Response(data, status=status.HTTP_201_CREATED)
                else:
                    print("errors: ", prompt_serializer.errors)
                    return Response(prompt_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(content_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(entry_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
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

    def get(self, request, entry_id):
        try:
            content = JournalEntryContent.objects.get(entry_id=entry_id, user=request.user)
            serializer = JournalEntryContentSerializer(content)
            return Response(serializer.data)
        except JournalEntryContent.DoesNotExist:
            return Response({'detail': 'Journal entry content not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, entry_id):
        try:
            content = JournalEntryContent.objects.get(entry_id=entry_id, user=request.user)
            request_data = request.data
            request_data['entry_id'] = entry_id
            serializer = JournalEntryContentSerializer(content, data=request_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JournalEntryContent.DoesNotExist:
            return Response({'detail': 'Journal entry content not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, entry_id):
        try:
            content = JournalEntryContent.objects.get(entry_id=entry_id, user=request.user)
            serializer = JournalEntryContentSerializer(content, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JournalEntryContent.DoesNotExist:
            return Response({'detail': 'Journal entry content not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
class JournalPromptAPIView(APIView): 
    permission_classes = [IsAuthenticated]

    def get(self, request, entry_id):
        try:
            content = JournalPrompt.objects.get(entry_id=entry_id, user=request.user)
            serializer = JournalPromptSerializer(content)
            return Response(serializer.data)
        except JournalPrompt.DoesNotExist:
            return Response({'detail': 'Journal prompt not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, entry_id):
        try:
            content = JournalPrompt.objects.get(entry_id=entry_id, user=request.user)
            request_data = request.data
            request_data['entry_id'] = entry_id
            serializer = JournalPromptSerializer(content, data=request_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JournalPrompt.DoesNotExist:
            return Response({'detail': 'Journal prompt not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, entry_id):
        try:
            content = JournalPrompt.objects.get(entry_id=entry_id, user=request.user)
            serializer = JournalPromptSerializer(content, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JournalPrompt.DoesNotExist:
            return Response({'detail': 'Journal prompt not found'}, status=status.HTTP_404_NOT_FOUND)
        

class CreateUserAPIView(APIView):
    def post(self, request):
        form = SignupForm(request.data)  # Replace with your actual form or serializer
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            form.save()
            user = authenticate(request, username=username, password=password)

            if user:
                login(request, user)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response({'detail': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'detail': 'Invalid signup data'}, status=status.HTTP_400_BAD_REQUEST)

class GetUserAPIView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class CurrentUserAPIView(APIView):
    def get(self, request):
        user = request.user
        if user and user.id is not None:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'No user is currently logged in'}, status=status.HTTP_404_NOT_FOUND)

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
        
        content_list = []
        for serialized_entry in entry_serializer.data[::-1]:
            try:
                if len(content_list) < 3:
                    content = JournalEntryContent.objects.get(entry_id=serialized_entry['id'], user=request.user)
                    content_txt = JournalEntryContentSerializer(content).data['content']
                    content_list.append(content_txt)
                else:
                    break
            except JournalEntryContent.DoesNotExist:
                continue
        
        print("content_list: ", content_list)
        print("Entries fetched: ", entries)
        
        # Preprocess entries
        prompt_text = JOURNAL_ENTRY_PREPEND + "\n\n".join(content_list)
        print("prompt_text: ", prompt_text)
        
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_text},
        ]
        
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=messages
        )
        
        response_text = response.choices[0].message.content
        response_list = [i[3:] for i in response_text.split('\n')]
        
        return Response({"prompts": response_list}, status=status.HTTP_200_OK)
