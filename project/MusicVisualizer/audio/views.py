from django.shortcuts import render
from django.core.files.base import ContentFile
from MusicVisualizer.settings import MEDIA_URL
from django.http import HttpResponse

# Create your views here.

def index(request):
    return render(request, 'index.html')