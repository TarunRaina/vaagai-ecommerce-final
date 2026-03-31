from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count, Avg, Q, F
from django.utils import timezone
from datetime import timedelta
from orders.models import Order, OrderItem
from products.models import Product, Category, Review
from accounts.models import User
from appointments.models import Appointment
from b2b.models import B2BApplication

class AnalyticsOverviewView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        # 1. Commercial Core (Paid Only)
        commercial_query = Order.objects.filter(payment_status='paid')
        total_revenue = commercial_query.aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.count()
        paid_orders = commercial_query.count()
        
        b2b_revenue = commercial_query.filter(order_type='b2b').aggregate(total=Sum('total_amount'))['total'] or 0
        b2c_revenue = commercial_query.filter(order_type='individual').aggregate(total=Sum('total_amount'))['total'] or 0
        
        avg_order_value = total_revenue / paid_orders if paid_orders > 0 else 0
        
        # 2. Relationship Map
        total_customers = User.objects.filter(user_type='customer').count()
        new_customers_30d = User.objects.filter(user_type='customer', date_joined__gte=thirty_days_ago).count()
        b2b_partners = User.objects.filter(is_verified_business=True).count()
        avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0

        # 3. Category Intelligence
        category_revenue = OrderItem.objects.filter(order__payment_status='paid').values(
            'product__category__name'
        ).annotate(
            revenue=Sum(F('price') * F('quantity')),
            units=Sum('quantity')
        ).order_by('-revenue')

        # 4. Monthly Trends (Fixing the "Double Month" logic)
        trends = []
        # Calculate exactly 6 months back from current month's start
        first_day_current = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        for i in range(5, -1, -1):
            # Using a simplified but robust calendar month offset
            # (month - i) logic
            m = first_day_current.month - i
            y = first_day_current.year
            while m <= 0:
                m += 12
                y -= 1
            
            month_start = first_day_current.replace(year=y, month=m)
            # Find next month
            nm = m + 1
            ny = y
            if nm > 12:
                nm = 1
                ny = y + 1
            month_end = month_start.replace(year=ny, month=nm)
            
            month_rev = commercial_query.filter(
                created_at__gte=month_start, 
                created_at__lt=month_end
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            trends.append({
                "month": month_start.strftime("%b"),
                "full_month": month_start.strftime("%B %Y"),
                "revenue": float(month_rev)
            })

        # 5. Geographical Intelligence (New)
        from orders.utils import get_state_from_pincode
        geo_data = {}
        for order in commercial_query:
            state = get_state_from_pincode(order.pincode)
            if state not in geo_data:
                geo_data[state] = {"name": state, "orders": 0, "revenue": 0}
            geo_data[state]["orders"] += 1
            geo_data[state]["revenue"] += float(order.total_amount or 0)
        
        geography_performance = sorted(geo_data.values(), key=lambda x: x['revenue'], reverse=True)

        # 6. Inventory & Operations
        top_products = Product.objects.annotate(
            revenue=Sum(F('orderitem__price') * F('orderitem__quantity'), filter=Q(orderitem__order__payment_status='paid')),
            sales_count=Count('orderitem', filter=Q(orderitem__order__payment_status='paid'))
        ).filter(revenue__gt=0).order_by('-revenue')[:5]
        
        low_stock_count = Product.objects.filter(stock__lt=10, is_active=True).count()
        
        appointment_stats = Appointment.objects.aggregate(
            total=Count('id'),
            approved=Count('id', filter=Q(status='approved')),
            pending=Count('id', filter=Q(status='pending'))
        )

        return Response({
            "status": "success",
            "data": {
                "kpis": {
                    "total_revenue": float(total_revenue),
                    "total_orders": total_orders,
                    "paid_orders": paid_orders,
                    "total_customers": total_customers,
                    "avg_order_value": float(avg_order_value),
                    "new_customers_30d": new_customers_30d,
                    "b2b_partners": b2b_partners,
                    "avg_rating": round(float(avg_rating), 1),
                    "low_stock_count": low_stock_count
                },
                "revenue_split": {
                    "b2b": float(b2b_revenue),
                    "b2c": float(b2c_revenue)
                },
                "category_performance": [
                    {
                        "name": item['product__category__name'] or "Uncategorized",
                        "revenue": float(item['revenue']),
                        "units": item['units']
                    } for item in category_revenue
                ],
                "top_products": [
                    {
                        "id": p.id, 
                        "name": p.name, 
                        "sales": p.sales_count, 
                        "revenue": float(p.revenue or 0)
                    } for p in top_products
                ],
                "geography_performance": geography_performance,
                "appointment_health": appointment_stats,
                "trends": trends
            }
        })
from django.http import HttpResponse
from .report_generator import generate_analytics_pdf
from .utils import get_ai_analytics_summary

class AnalyticsExecutiveReportView(APIView):
    permission_classes = [IsAdminUser]

    def get_data(self):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        commercial_query = Order.objects.filter(payment_status='paid')
        total_revenue = commercial_query.aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.count()
        paid_orders = commercial_query.count()
        avg_order_value = total_revenue / paid_orders if paid_orders > 0 else 0
        
        top_products = Product.objects.annotate(
            sales_count=Count('orderitem', filter=Q(orderitem__order__payment_status='paid'))
        ).order_by('-sales_count')[:5]
        
        low_stock_count = Product.objects.filter(stock__lt=10, is_active=True).count()
        total_customers = User.objects.filter(user_type='customer').count()
        b2b_partners = User.objects.filter(is_verified_business=True).count()
        avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0

        return {
            "kpis": {
                "total_revenue": float(total_revenue),
                "total_orders": total_orders,
                "paid_orders": paid_orders,
                "total_customers": total_customers,
                "avg_order_value": float(avg_order_value),
                "b2b_partners": b2b_partners,
                "avg_rating": round(float(avg_rating), 1),
                "low_stock_count": low_stock_count
            },
            "top_products": [
                {"name": p.name, "sales": p.sales_count, "revenue": float(p.sales_count * p.price)}
                for p in top_products
            ],
            "generated_at": now.strftime("%Y-%m-%d %H:%M:%S")
        }

    def get(self, request):
        data = self.get_data()
        
        # 1. Get AI Synthesis
        ai_summary = get_ai_analytics_summary(data)
        
        # 2. Generate PDF
        pdf_content = generate_analytics_pdf(data, ai_summary)
        
        # 3. Return as Download
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="Vaagai_Executive_Intelligence_Report.pdf"'
        return response

class DailyTrendsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            days = int(request.query_params.get('days', 7))
            offset = int(request.query_params.get('offset', 0))
        except ValueError:
            return Response({"error": "Invalid days or offset parameters"}, status=400)
        
        # Calculate the date range
        # Use timezone.now().date() for the current date in the system's timezone
        now_date = timezone.now().date()
        end_date = now_date - timedelta(days=offset)
        start_date = end_date - timedelta(days=days - 1)
        
        # Query orders in range
        # Note: created_at is a DateTimeField, created_at__date extracts the date part
        orders = Order.objects.filter(
            payment_status='paid',
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        ).values(date_only=F('created_at__date')).annotate(revenue=Sum('total_amount')).order_by('date_only')
        
        # Map existing data for quick lookup
        data_map = {o['date_only'].strftime('%Y-%m-%d'): float(o['revenue']) for o in orders}
        
        # Fill in missing dates with zero revenue to ensure a continuous graph
        trends = []
        for i in range(days):
            current_date = start_date + timedelta(days=i)
            date_str = current_date.strftime('%Y-%m-%d')
            display_date = current_date.strftime('%d %b') # Format: "15 Mar"
            trends.append({
                "date": date_str,
                "display": display_date,
                "revenue": data_map.get(date_str, 0)
            })
            
        return Response({
            "status": "success",
            "data": trends,
            "meta": {
                "start_date": start_date.strftime('%Y-%m-%d'),
                "end_date": end_date.strftime('%Y-%m-%d'),
                "days": days,
                "offset": offset,
                "has_next": offset > 0, # Can scroll forward (towards today)
                "has_prev": True        # Can always scroll backward
            }
        })
