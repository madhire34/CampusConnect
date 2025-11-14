
from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.conf import settings
import json
from pathlib import Path

UNIVERSITIES = {
    "skyline-university": {
        "name": "Skyline University",
        "tagline": "Future-focused private university in Bangalore.",
        "location": "Bangalore, Karnataka",
        "courses": [
            {"name": "B.Tech Computer Science", "duration": "4 years"},
            {"name": "MBA", "duration": "2 years"},
            {"name": "BBA", "duration": "3 years"},
        ],
        "fees_summary": "₹1.5L – ₹3L per year (course-wise breakup available).",
        "placements_summary": "Highest 24 LPA | Average 7.5 LPA | 200+ recruiters.",
        "facilities": ["Hostel", "Library", "Innovation Lab", "Sports Complex", "Wi-Fi Campus"],
    },
    "riverdale-institute": {
        "name": "Riverdale Institute of Technology",
        "tagline": "Industry-linked tech institute in Pune.",
        "location": "Pune, Maharashtra",
        "courses": [
            {"name": "B.Tech AI & ML", "duration": "4 years"},
            {"name": "BCA", "duration": "3 years"},
            {"name": "MCA", "duration": "2 years"},
        ],
        "fees_summary": "₹80K – ₹2.6L per year depending on program.",
        "placements_summary": "Highest 20 LPA | Average 6.2 LPA | Strong IT placements.",
        "facilities": ["Hostel", "Central Library", "Research Center", "Cafeteria"],
    },
}


def university_a_landing(request):
    """
    LP-1: Landing page for Skyline University (private university).
    Renders a template and injects university-specific data.
    """
    uni = UNIVERSITIES["skyline-university"]
    context = {"university": uni}
    return render(request, "landing/university_a.html", context)


def university_b_landing(request):
    """
    LP-2: Landing page for Riverdale Institute (second private university).
    """
    uni = UNIVERSITIES["riverdale-institute"]
    context = {"university": uni}
    return render(request, "landing/university_b.html", context)


def lp_aurora(request):
    """SPA Landing Page 1 (Aurora Tech University)."""
    return render(request, "landing/lp_aurora.html")


def lp_novus(request):
    """SPA Landing Page 2 (Novus School of Business)."""
    return render(request, "landing/lp_novus.html")


# ---- Simple JSON APIs for assignment ----

def api_universities(request):
    """Return a simple JSON list of universities with basic info."""
    data = [
        {
            "slug": slug,
            "name": info["name"],
            "location": info["location"],
        }
        for slug, info in UNIVERSITIES.items()
    ]
    return JsonResponse({"universities": data})


def api_university_detail(request, slug):
    """Return nested JSON for a single university (courses, fees, facilities)."""
    uni = UNIVERSITIES.get(slug)
    if not uni:
        raise Http404("University not found")
    return JsonResponse({"slug": slug, **uni})


def api_fees(request):
    """Return nested JSON fee data loaded from assets/fees.json."""
    fees_path = Path(settings.BASE_DIR) / "assets" / "fees.json"
    try:
        with fees_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return JsonResponse({"error": "fees.json not found"}, status=500)

    return JsonResponse({"fees": data})
