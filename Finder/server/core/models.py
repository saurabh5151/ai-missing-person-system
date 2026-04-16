from django.db import models
from django.contrib.auth.models import User
import pickle


import os

def delete(self, *args, **kwargs):
    if self.photo:
        if os.path.isfile(self.photo.path):
            os.remove(self.photo.path)
    super().delete(*args, **kwargs)

class PoliceStation(models.Model):
    name = models.CharField(max_length=150)
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.TextField()

    def __str__(self):
        return self.name


class MissingPerson(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    last_seen_location = models.CharField(max_length=255)
    photo = models.ImageField(upload_to="missing_photos/")
    embedding = models.BinaryField()

    STATUS_CHOICES = (
        ("MISSING", "Missing"),
        ("FOUND", "Found"),
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="MISSING"
    )

    def set_embedding(self, embedding_array):
        self.embedding = pickle.dumps(embedding_array)

    def get_embedding(self):
        return pickle.loads(self.embedding)

    def __str__(self):
        return f"{self.name} ({self.status})"


class FoundPerson(models.Model):
    photo = models.ImageField(upload_to="found/")
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    matched_missing = models.ForeignKey(
        MissingPerson,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    police_station = models.ForeignKey(
        PoliceStation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"FoundPerson #{self.id}"

class CaseHistory(models.Model):

    ACTION_CHOICES = (
        ("CREATED", "Case Created"),
        ("MATCH_FOUND", "Match Found"),
        ("STATUS_UPDATED", "Status Updated"),
        ("CLOSED", "Case Closed"),
    )

    missing_person = models.ForeignKey(
        MissingPerson,
        on_delete=models.CASCADE,
        related_name="history"
    )

    action = models.CharField(max_length=20, choices=ACTION_CHOICES)

    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.missing_person.name} - {self.action}"

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ("PUBLIC", "Public"),
        ("POLICE", "Police"),
        ("ADMIN", "Admin"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
