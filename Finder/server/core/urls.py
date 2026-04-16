from django.urls import path
from .views import face_match_api, search_missing_person, create_missing_person,report_found_person,list_missing_persons,police_dashboard ,update_case_status,register_public,send_otp,register_police,delete_report

urlpatterns = [
    path("face-match/", face_match_api),
    path("search-missing/", search_missing_person),
    path("create-missing/", create_missing_person),
    path("report-found/", report_found_person),
    path("missing/list/", list_missing_persons),
    path("dashboard/police/", police_dashboard),
    path("case/update/", update_case_status),
    path("register/public/", register_public),
    path("send-otp/", send_otp),
    path("register/police/", register_police),
    path("report/delete/", delete_report),
]



