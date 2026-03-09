from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import B2BApplication, B2BDiscountSettings
from .serializers import B2BApplicationSerializer, B2BDiscountSettingsSerializer, B2BReviewSerializer
from accounts.models import User

class B2BApplyView(generics.CreateAPIView):
    serializer_class = B2BApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Check if an application already exists
        application = B2BApplication.objects.filter(user=request.user).first()
        
        if application:
            if application.status == 'rejected':
                # Allow re-submission if rejected
                serializer = self.get_serializer(application, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save(status='pending')
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Still pending or already approved
                return Response(
                    {"error": f"Application already {application.status}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create new application if none exists
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='pending')

class MyB2BApplicationView(generics.RetrieveAPIView):
    serializer_class = B2BApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return B2BApplication.objects.get(user=self.request.user)

class AdminB2BListView(generics.ListAPIView):
    serializer_class = B2BApplicationSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = B2BApplication.objects.all().order_by('-created_at')

class AdminB2BReviewView(generics.UpdateAPIView):
    serializer_class = B2BReviewSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = B2BApplication.objects.all()

    def perform_update(self, serializer):
        application = serializer.save()
        if application.status == 'approved':
            user = application.user
            user.is_verified_business = True
            user.save()
        elif application.status == 'rejected':
            user = application.user
            user.is_verified_business = False
            user.save()

class B2BSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = B2BDiscountSettingsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        obj, created = B2BDiscountSettings.objects.get_or_create(id=1)
        return obj
