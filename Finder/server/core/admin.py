from django.contrib import admin
from .models import MissingPerson
from .models import UserProfile

admin.site.register(MissingPerson)
admin.site.register(UserProfile)

