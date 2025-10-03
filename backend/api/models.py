from django.db import models
import uuid


class ApiKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    key_hash = models.CharField(max_length=128, unique=True)  # sha256 hex
    scopes = models.JSONField(default=list, blank=True)
    revoked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ApiKey {self.name} ({'REVOKED' if self.revoked else 'ACTIVE'})"


class Job(models.Model):
    JOB_TYPES = (
        ("audio", "Audio"),
        ("video", "Video"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job_type = models.CharField(max_length=16, choices=JOB_TYPES)
    status = models.CharField(max_length=32, default="PENDING")  # PENDING, RUNNING, DONE, ERROR
    target_lang = models.CharField(max_length=32, default="hi")

    # input and generated outputs
    input_path = models.FilePathField(path="", max_length=512, blank=True)
    transcript_text = models.TextField(blank=True)
    translation_text = models.TextField(blank=True)
    srt_path = models.FilePathField(path="", max_length=512, blank=True)
    vtt_path = models.FilePathField(path="", max_length=512, blank=True)
    dubbed_audio_path = models.FilePathField(path="", max_length=512, blank=True)
    dubbed_video_path = models.FilePathField(path="", max_length=512, blank=True)

    error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Job {self.id} ({self.job_type}) {self.status}"

# Create your models here.
