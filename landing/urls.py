from django.urls import path
from . import views


urlpatterns = [
    path('',views.university_a_landing, name='university_a'),
    path('university-b/', views.university_b_landing, name='university_b'),
]