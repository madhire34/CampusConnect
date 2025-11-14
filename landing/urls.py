from django.urls import path
from . import views


urlpatterns = [
    # Landing pages (LP-1 and LP-2)
    path('', views.lp_aurora, name='lp_aurora'),
    path('lp-novus/', views.lp_novus, name='lp_novus'),

    # Simple JSON APIs for assignment
    path('api/universities/', views.api_universities, name='api_universities'),
    path('api/universities/<slug:slug>/', views.api_university_detail, name='api_university_detail'),
    path('api/fees/', views.api_fees, name='api_fees'),
]
