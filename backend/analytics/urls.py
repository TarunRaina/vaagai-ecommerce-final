from django.urls import path
from .views import AnalyticsOverviewView, AnalyticsExecutiveReportView, DailyTrendsView

urlpatterns = [
    path('overview/', AnalyticsOverviewView.as_view(), name='analytics-overview'),
    path('daily-trends/', DailyTrendsView.as_view(), name='daily-trends'),
    path('export-report/', AnalyticsExecutiveReportView.as_view(), name='export-report'),
]
