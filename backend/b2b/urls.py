from django.urls import path
from .views import B2BApplyView, MyB2BApplicationView, AdminB2BListView, AdminB2BReviewView, B2BSettingsView

urlpatterns = [
    path('apply/', B2BApplyView.as_view(), name='b2b-apply'),
    path('my-application/', MyB2BApplicationView.as_view(), name='my-b2b-application'),
    path('admin/list/', AdminB2BListView.as_view(), name='admin-b2b-list'),
    path('admin/review/<int:pk>/', AdminB2BReviewView.as_view(), name='admin-b2b-review'),
    path('admin/settings/', B2BSettingsView.as_view(), name='b2b-settings'),
]
