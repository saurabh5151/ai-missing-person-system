from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from core.face_auth.engine import extract_embedding, match_faces
from .models import MissingPerson, FoundPerson, CaseHistory
from .serializers import MissingPersonPublicSerializer
from django.db.models import Count
import tempfile
import numpy as np
from .models import FoundPerson
from core.models import PoliceStation
from core.utils.location import haversine
from .permissions import IsAdmin, IsPolice, IsPublic
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.contrib.auth.models import User
from .models import UserProfile, PoliceStation
import random
import math




class ReportPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"


@api_view(['POST'])
def face_match_api(request):
    img1 = request.FILES.get('image1')
    img2 = request.FILES.get('image2')

    if not img1 or not img2:
        return Response({"error": "Both images required"}, status=400)

    temp1 = tempfile.NamedTemporaryFile(delete=False)
    temp2 = tempfile.NamedTemporaryFile(delete=False)

    temp1.write(img1.read())
    temp2.write(img2.read())

    emb1 = extract_embedding(temp1.name)
    emb2 = extract_embedding(temp2.name)

    if emb1 is None or emb2 is None:
        return Response({"match": False, "score": 0})

    score = match_faces(emb1, emb2)

    return Response({
        "match": score > 0.6,
        "similarity_score": float(score)
    })


@api_view(["POST"])
@permission_classes([IsPolice])
def create_missing_person(request):

    name = request.data.get("name")
    age = request.data.get("age")
    last_seen_location = request.data.get("last_seen_location")
    photo = request.FILES.get("photo")

    if not all([name, age, last_seen_location, photo]):
        return Response({"error": "All fields required"}, status=400)

    temp = tempfile.NamedTemporaryFile(delete=False)
    temp.write(photo.read())
    temp.flush()  
    temp.close()   
    embedding = extract_embedding(temp.name)

    if embedding is None:
        return Response({"error": "No face detected"}, status=400)

    person = MissingPerson(
        name=name,
        age=age,
        last_seen_location=last_seen_location,
        photo=photo
    )

    person.set_embedding(embedding)
    person.save()
    CaseHistory.objects.create(
    missing_person=person,
    action="CREATED",
    performed_by=request.user,
    note="Missing person case created"
)

    return Response({
        "message": "Missing person registered successfully",
        "id": person.id
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def search_missing_person(request):
    photo = request.FILES.get("photo")

    if not photo:
        return Response({"error": "Photo is required"}, status=400)

    temp = tempfile.NamedTemporaryFile(delete=False)
    temp.write(photo.read())

    query_embedding = extract_embedding(temp.name)

    if query_embedding is None:
        return Response({"error": "No face detected"}, status=400)

    best_score = 0
    best_match = None

    for person in MissingPerson.objects.all():
        score = match_faces(query_embedding, person.get_embedding())
        if score > best_score:
            best_score = score
            best_match = person

    if best_match and best_score > 0.6:
        return Response({
        "match_found": True,
        "message": "Match found!",
        "person": {
            "name": best_match.name,
            "age": best_match.age,
            "last_seen_location": best_match.last_seen_location,
            "photo": best_match.photo.url
        },
        "confidence": float(best_score)
    })

    return Response({
        "match_found": False,
        "message": "No matching missing report found."
    })

@api_view(["POST"])
@permission_classes([IsPublic])
def report_found_person(request):
    photo = request.FILES.get("photo")
    latitude = float(request.data.get("latitude"))
    longitude = float(request.data.get("longitude"))
    nearest_station = get_nearest_police_station(latitude, longitude)

    if not all([photo, latitude, longitude]):
        return Response({"error": "Photo and GPS location required"}, status=400)

    temp = tempfile.NamedTemporaryFile(delete=False)
    temp.write(photo.read())
    temp.close()

    query_embedding = extract_embedding(temp.name)

    if query_embedding is None:
        return Response({"error": "No face detected"}, status=400)

    best_score = 0
    best_match = None

    for person in MissingPerson.objects.all():
        score = match_faces(query_embedding, person.get_embedding())
        if score > best_score:
            best_score = score
            best_match = person

    nearest_station = get_nearest_police_station(
        float(latitude),
        float(longitude)
    )

    found = FoundPerson.objects.create(
        photo=photo,
        latitude=float(latitude),
        longitude=float(longitude),
        matched_missing=best_match if best_score > 0.6 else None,
        police_station=nearest_station
    ) 

    return Response({
        "saved": True,
        "match_found": best_score > 0.6,
        "confidence": float(best_score),
        "police_station": nearest_station.name if nearest_station else None
    })

@api_view(["GET"])
@permission_classes([AllowAny])   
def list_missing_persons(request):
    persons = MissingPerson.objects.filter(status="MISSING").order_by("-id")
    serializer = MissingPersonPublicSerializer(persons, many=True)
    return Response(serializer.data)

def calculate_distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

def get_nearest_police_station(lat, lon):
    stations = PoliceStation.objects.all()
    nearest = None
    min_distance = float("inf")

    for station in stations:
        dist = calculate_distance(lat, lon, station.latitude, station.longitude)

        if dist < min_distance:
            min_distance = dist
            nearest = station

    return nearest

@api_view(["GET"])
@permission_classes([IsPolice])
def police_dashboard(request):
    reports = FoundPerson.objects.all().order_by("-created_at")

    paginator = ReportPagination()
    paginated_reports = paginator.paginate_queryset(reports, request)

    data = []

    for report in paginated_reports:
        item = {
            "id": report.id,
            "photo": report.photo.url if report.photo else None,
            "latitude": report.latitude,
            "longitude": report.longitude,
            "reported_at": report.created_at,
            "match_found": report.matched_missing is not None,
        }

        if report.matched_missing:
            item["missing_person"] = {
                "id": report.matched_missing.id,
                "name": report.matched_missing.name,
                "age": report.matched_missing.age,
                "last_seen_location": report.matched_missing.last_seen_location,
                "photo": report.matched_missing.photo.url,
                "status": report.matched_missing.status,
            }

        data.append(item)

    return paginator.get_paginated_response(data)

def get_nearest_police_station(latitude, longitude):
    stations = PoliceStation.objects.all()

    if not stations.exists():
        return None

    nearest_station = None
    min_distance = float("inf")

    for station in stations:
        distance = (
            (station.latitude - latitude) ** 2 +
            (station.longitude - longitude) ** 2
        )

        if distance < min_distance:
            min_distance = distance
            nearest_station = station

    return nearest_station
    
@api_view(["POST"])
@permission_classes([IsPolice])
def update_case_status(request):

    report_id = request.data.get("report_id")

    print("API HIT")
    print("REPORT ID:", report_id)

    if not report_id:
        return Response({"error": "report_id required"}, status=400)

    try:
        report = FoundPerson.objects.get(id=report_id)
    except FoundPerson.DoesNotExist:
        return Response({"error": "Report not found"}, status=404)

    print("MATCHED ID:", report.matched_missing_id)

    # ❗ CRITICAL FIX
    if report.matched_missing:
        person = report.matched_missing
        person.status = "FOUND"
        person.save()

        print("UPDATED:", person.id, person.status)

    # delete report
    report.delete()

    return Response({"message": "Marked as FOUND"})


@api_view(["POST"])
@permission_classes([AllowAny])
def register_public(request):
    username = request.data.get("username")
    phone = request.data.get("phone")
    password = request.data.get("password")
    otp = request.data.get("otp")

    # 🔥 CHECK OTP
    if otp_store.get(phone) != otp:
        return Response({"error": "Invalid OTP"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password
    )
    UserProfile.objects.create(
    user=user,
    role="PUBLIC"
)

    return Response({"message": "User registered"})

otp_store = {}  
@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    phone = request.data.get("phone")

    if not phone:
        return Response({"error": "Phone required"}, status=400)

    otp = str(random.randint(100000, 999999))

    otp_store[phone] = otp

    print("OTP for", phone, "is:", otp)  # 🔥 PRINT IN TERMINAL

    return Response({
        "message": "OTP sent",
        "otp": otp   # ⚠️ ONLY FOR TESTING
    })




# 🔥 State codes
STATE_CODES = {
    "punjab": "PB",
    "delhi": "DL",
    "uttar pradesh": "UP",
}

# 🔥 District code helper
def get_district_code(name):
    return name[:3].upper()


@api_view(["POST"])
@permission_classes([AllowAny])
def register_police(request):
    station_name = request.data.get("station_name")
    state = request.data.get("state")
    district = request.data.get("district")
    password = request.data.get("password")

    # ❌ Validation
    if not all([station_name, state, district, password]):
        return Response({"error": "All fields required"}, status=400)

    try:
        # ✅ Generate codes
        state_code = STATE_CODES.get(state.lower(), state[:2].upper())
        district_code = get_district_code(district)
        number = str(random.randint(100, 999))

        police_code = f"{state_code}-{district_code}-{number}"

        # ✅ Create user
        user = User.objects.create_user(
            username=police_code,
            password=password
        )

        # ✅ VERY IMPORTANT (fixes 403 issue)
        UserProfile.objects.create(
            user=user,
            role="POLICE"
        )

        return Response({
            "message": "Police registered successfully",
            "code": police_code
        })

    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)
    
    
@api_view(["POST"])
@permission_classes([IsPolice])
def delete_report(request):

    report_id = request.data.get("report_id")

    if not report_id:
        return Response({"error": "report_id required"}, status=400)

    try:
        report = FoundPerson.objects.get(id=report_id)
    except FoundPerson.DoesNotExist:
        return Response({"error": "Report not found"}, status=404)

    report.delete()

    return Response({
        "message": "Report deleted successfully"
    })