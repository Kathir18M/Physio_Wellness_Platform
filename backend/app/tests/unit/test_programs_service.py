"""
Unit tests for Program domain schemas and slug generation helper.
"""

from app.domains.programs.schemas import ProgramCreate, ProgramModuleCreate, ProgramRead
from app.domains.programs.service import _slugify


def test_slugify_helper() -> None:
    assert _slugify("Spine & Posture Core Reset") == "spine-posture-core-reset"
    assert _slugify("ACL Knee Recovery!") == "acl-knee-recovery"


def test_program_schema_validation() -> None:
    data = ProgramCreate(
        name="Test Program",
        description="A test description for rehab.",
        category="Spine",
        duration="4 Weeks",
        price=149.99,
        modules=[
            ProgramModuleCreate(name="Week 1: Core Decompression", order_index=1),
            ProgramModuleCreate(name="Week 2: Lumbar Extension", order_index=2),
        ],
    )

    assert data.name == "Test Program"
    assert len(data.modules) == 2
    assert data.modules[0].name == "Week 1: Core Decompression"
