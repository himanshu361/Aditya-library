from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import admin_router, auth_router, chapters_router, classes_router, notes_router, payments_router, quizzes_router, users_router
from app.auth import hash_password
from app.database import SessionLocal, Base, engine, ensure_sqlite_compatibility
from app.models.access_log import AccessLog
from app.models.chapter import Chapter
from app.models.class_model import SchoolClass
from app.models.purchase import Purchase
from app.models.reading_session import ReadingSession
from app.models.subject import Subject
from app.models.user import User

Base.metadata.create_all(bind=engine)
ensure_sqlite_compatibility()

CHAPTER_CATALOG = {
    9: {
        "Physics": [
            "Basic Physical Quantities and Measurement",
            "Motion",
            "Force and Laws of Motion",
            "Gravitation",
            "Work and Energy",
            "Sound",
        ],
        "Chemistry": [
            "Matter and Its Nature",
            "Is Matter Around Us Pure?",
            "Atoms and Molecules",
            "Structure of the Atom",
            "Chemical Changes and Reactions",
            "Elements and Compounds",
            "Basic Chemical Calculations",
        ],
        "Mathematics": [
            "Number Systems",
            "Polynomials",
            "Coordinate Geometry",
            "Linear Equations in Two Variables",
            "Introduction to Euclid's Geometry",
            "Lines and Angles",
            "Triangles",
            "Quadrilaterals",
            "Circles",
            "Heron's Formula",
            "Surface Areas and Volumes",
            "Statistics",
            "Probability",
            "Mathematical Reasoning, Modelling and Applications",
        ],
        "English - Core Skills": [
            "Reading Comprehension",
            "Grammar",
            "Writing",
            "Literature",
            "Vocabulary",
            "Language Skills",
        ],
        "English - Kaveri": [
            "Kaveri Textbook",
        ],
        "English - Beehive - Prose": [
            "The Fun They Had",
            "The Sound of Music",
            "The Little Girl",
            "A Truly Beautiful Mind",
            "The Snake and the Mirror",
            "My Childhood",
            "Reach for the Top",
            "Kathmandu",
            "If I Were You",
        ],
        "English - Beehive - Poems": [
            "The Road Not Taken",
            "Wind",
            "Rain on the Roof",
            "The Lake Isle of Innisfree",
            "A Legend of the Northland",
            "No Men Are Foreign",
            "The Duck and the Kangaroo",
            "On Killing a Tree",
            "The Snake Trying",
            "A Slumber Did My Spirit Seal",
        ],
        "English - Moments": [
            "The Lost Child",
            "The Adventures of Toto",
            "Iswaran the Storyteller",
            "In the Kingdom of Fools",
            "The Happy Prince",
            "Weathering the Storm in Ersama",
            "The Last Leaf",
            "A House Is Not a Home",
            "The Beggar",
        ],
    },
    10: {
        "Physics": [
            "Light – Reflection and Refraction",
            "The Human Eye and the Colourful World",
            "Electricity",
            "Magnetic Effects of Electric Current",
            "Sources of Energy",
        ],
        "Chemistry": [
            "Chemical Reactions and Equations",
            "Acids, Bases and Salts",
            "Metals and Non-metals",
            "Carbon and Its Compounds",
            "Periodic Classification of Elements",
        ],
        "Mathematics": [
            "Real Numbers",
            "Polynomials",
            "Pair of Linear Equations in Two Variables",
            "Quadratic Equations",
            "Arithmetic Progressions",
            "Triangles",
            "Coordinate Geometry",
            "Introduction to Trigonometry",
            "Some Applications of Trigonometry",
            "Circles",
            "Areas Related to Circles",
            "Surface Areas and Volumes",
            "Statistics",
            "Probability",
        ],
        "English - First Flight - Prose": [
            "A Letter to God",
            "Nelson Mandela: Long Walk to Freedom",
            "Two Stories About Flying",
            "From the Diary of Anne Frank",
            "Glimpses of India",
            "Mijbil the Otter",
            "Madam Rides the Bus",
            "The Sermon at Benares",
            "The Proposal",
        ],
        "English - First Flight - Poems": [
            "Dust of Snow",
            "Fire and Ice",
            "A Tiger in the Zoo",
            "How to Tell Wild Animals",
            "The Ball Poem",
            "Amanda!",
            "Animals",
            "The Trees",
            "Fog",
            "The Tale of Custard the Dragon",
            "For Anne Gregory",
        ],
        "English - Footprints Without Feet": [
            "A Triumph of Surgery",
            "The Thief's Story",
            "The Midnight Visitor",
            "A Question of Trust",
            "Footprints Without Feet",
            "The Making of a Scientist",
            "The Necklace",
            "Bholi",
            "The Book That Saved the Earth",
        ],
        "English - Core Skills": [
            "Reading Comprehension",
            "Grammar",
            "Writing",
            "Literature",
            "Vocabulary",
            "Language Skills",
        ],
        "English - Kaveri": [
            "Kaveri Textbook",
        ],
    },
    11: {
        "Physics": [
            "Units and Measurements",
            "Motion in a Straight Line",
            "Motion in a Plane",
            "Laws of Motion",
            "Work, Energy and Power",
            "System of Particles and Rotational Motion",
            "Gravitation",
            "Mechanical Properties of Solids",
            "Mechanical Properties of Fluids",
            "Thermal Properties of Matter",
            "Thermodynamics",
            "Kinetic Theory",
            "Oscillations",
            "Waves",
        ],
        "Chemistry": [
            "Some Basic Concepts of Chemistry",
            "Structure of Atom",
            "Classification of Elements and Periodicity in Properties",
            "Chemical Bonding and Molecular Structure",
            "Thermodynamics",
            "Equilibrium",
            "Redox Reactions",
            "Organic Chemistry – Some Basic Principles and Techniques",
            "Hydrocarbons",
        ],
        "Mathematics": [
            "Sets",
            "Relations and Functions",
            "Trigonometric Functions",
            "Principle of Mathematical Induction",
            "Complex Numbers and Quadratic Equations",
            "Linear Inequalities",
            "Permutations and Combinations",
            "Binomial Theorem",
            "Sequences and Series",
            "Straight Lines",
            "Conic Sections",
            "Introduction to Three-Dimensional Geometry",
            "Limits and Derivatives",
            "Mathematical Reasoning",
            "Statistics",
            "Probability",
        ],
        "English - Hornbill - Prose": [
            "The Portrait of a Lady",
            "We're Not Afraid to Die... if We Can All Be Together",
            "Discovering Tut: The Saga Continues",
            "Landscape of the Soul",
            "The Ailing Planet: The Green Movement's Role",
            "The Browning Version",
            "The Adventure",
            "Silk Road",
        ],
        "English - Hornbill - Poems": [
            "A Photograph",
            "The Laburnum Top",
            "The Voice of the Rain",
            "Childhood",
            "Father to Son",
        ],
        "English - Snapshots": [
            "The Summer of the Beautiful White Horse",
            "The Address",
            "Ranga's Marriage",
            "Albert Einstein at School",
            "Mother's Day",
            "The Ghat of the Only World",
            "Birth",
            "The Tale of Melon City",
        ],
        "English - Core Skills": [
            "Unseen Passage and Reading Skills",
            "Case-Based Factual Passage",
            "Comprehension, Interpretation and Inference",
            "Vocabulary and Note-Making",
            "Summary Writing",
            "Tenses and Clauses",
            "Re-ordering and Transformation",
            "Classified Advertisement",
            "Creative Writing Tasks",
        ],
    },
    12: {
        "Physics": [
            "Electric Charges and Fields",
            "Electrostatic Potential and Capacitance",
            "Current Electricity",
            "Moving Charges and Magnetism",
            "Magnetism and Matter",
            "Electromagnetic Induction",
            "Alternating Current",
            "Electromagnetic Waves",
            "Ray Optics and Optical Instruments",
            "Wave Optics",
            "Dual Nature of Radiation and Matter",
            "Atoms",
            "Nuclei",
            "Semiconductor Electronics",
        ],
        "Chemistry": [
            "Solutions",
            "Electrochemistry",
            "Chemical Kinetics",
            "d- and f-Block Elements",
            "Coordination Compounds",
            "Haloalkanes and Haloarenes",
            "Alcohols, Phenols and Ethers",
            "Aldehydes, Ketones and Carboxylic Acids",
            "Amines",
            "Biomolecules",
        ],
        "Mathematics": [
            "Relations and Functions",
            "Inverse Trigonometric Functions",
            "Matrices",
            "Determinants",
            "Continuity and Differentiability",
            "Applications of Derivatives",
            "Integrals",
            "Applications of Integrals",
            "Differential Equations",
            "Vector Algebra",
            "Three-Dimensional Geometry",
            "Linear Programming",
            "Probability",
        ],
        "English - Flamingo - Prose": [
            "The Last Lesson",
            "Lost Spring",
            "Deep Water",
            "The Rattrap",
            "Indigo",
            "Poets and Pancakes",
            "The Interview",
            "Going Places",
        ],
        "English - Flamingo - Poems": [
            "My Mother at Sixty-Six",
            "An Elementary School Classroom in a Slum",
            "Keeping Quiet",
            "A Thing of Beauty",
            "A Roadside Stand",
            "Aunt Jennifer's Tigers",
        ],
        "English - Vistas": [
            "The Third Level",
            "The Tiger King",
            "Journey to the End of the Earth",
            "The Enemy",
            "Should Wizard Hit Mommy?",
            "On the Face of It",
            "Evans Tries an O-Level",
            "Memories of Childhood",
        ],
        "English - Core Skills": [
            "Unseen and Case-Based Reading",
            "Comprehension, Analysis and Inference",
            "Vocabulary",
            "Notice Writing",
            "Invitation and Reply",
            "Letter Writing",
            "Article and Report Writing",
        ],
    },
}


def seed_data():
    db = SessionLocal()
    try:
        for class_number, subject_map in CHAPTER_CATALOG.items():
            school_class = db.query(SchoolClass).filter(SchoolClass.class_number == class_number).first()
            if school_class is None:
                school_class = SchoolClass(class_number=class_number, class_name=f"Class {class_number}")
                db.add(school_class)
                db.commit()
                db.refresh(school_class)

            for subject_name, chapter_names in subject_map.items():
                subject = db.query(Subject).filter(
                    Subject.class_id == school_class.id,
                    Subject.subject_name == subject_name,
                ).first()
                if subject is None:
                    subject = Subject(class_id=school_class.id, subject_name=subject_name)
                    db.add(subject)
                    db.commit()
                    db.refresh(subject)

                existing_names = {
                    chapter.chapter_name
                    for chapter in db.query(Chapter).filter(Chapter.subject_id == subject.id).all()
                }
                next_number = db.query(Chapter).filter(Chapter.subject_id == subject.id).count() + 1
                for chapter_name in chapter_names:
                    if chapter_name in existing_names:
                        continue
                    chapter = Chapter(
                        subject_id=subject.id,
                        chapter_number=next_number,
                        chapter_name=chapter_name,
                        description=f"{subject_name} chapter on {chapter_name} for Class {class_number}.",
                        google_drive_file_id=f"drive_{class_number}_{subject_name.lower()}_{next_number}",
                        price=269,
                        status="active",
                    )
                    db.add(chapter)
                    next_number += 1
            db.commit()

        admin = db.query(User).filter(User.email == "admin@adityatuition.in").first()
        if not admin:
            admin_user = User(
                name="Admin",
                email="admin@adityatuition.in",
                phone="9999999999",
                password_hash=hash_password("admin123"),
                role="admin",
                status="active",
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()


seed_data()

app = FastAPI(title="Aditya Tuition Centre API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(classes_router, prefix="/api", tags=["classes"])
app.include_router(chapters_router, prefix="/api", tags=["chapters"])
app.include_router(notes_router, prefix="/api", tags=["notes"])
app.include_router(payments_router, prefix="/api", tags=["payments"])
app.include_router(quizzes_router, prefix="/api", tags=["quizzes"])
app.include_router(users_router, prefix="/api", tags=["users"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "aditya-tuition-centre"}


@app.get("/")
def root():
    return {"message": "Aditya Tuition Centre API", "docs": "/docs"}
