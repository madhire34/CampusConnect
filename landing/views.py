
from django.shortcuts import render

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