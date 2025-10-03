from django.urls import path
from . import views

urlpatterns = [
    path("health", views.health, name="health"),
    path("keys", views.keys, name="keys"),
    path("keys/<uuid:key_id>", views.key_detail, name="key-detail"),
    path("translate", views.translate, name="translate"),
    path("translate/audio", views.translate_audio, name="translate-audio"),
    path("translate/video", views.translate_video, name="translate-video"),
    path("translate/video-url", views.translate_video_url, name="translate-video-url"),
    path("jobs/<uuid:job_id>", views.job_status, name="job-status"),
    path("vocab", views.vocab, name="vocab"),
    path("workflows", views.workflows, name="workflows"),
    path("integrations/ncvet-msde", views.integrations_ncvet_msde, name="integrations-ncvet-msde"),
    path("integrations/lms", views.integrations_lms, name="integrations-lms"),
    path("accessibility/tts", views.accessibility_tts, name="accessibility-tts"),
    path("accessibility/stt", views.accessibility_stt, name="accessibility-stt"),
]
