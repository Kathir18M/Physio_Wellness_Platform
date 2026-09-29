"""
Prompt templates, versioning, clinical disclaimers, and PII sanitization for AI features.
"""

import re
from typing import Any, Dict

PROMPT_VERSIONS: Dict[str, str] = {
    "posture_analysis": "v1.2.0",
    "exercise_assistant": "v1.1.0",
    "progress_summary": "v1.0.0",
}

CLINICAL_DISCLAIMER: str = (
    "DISCLAIMER: This analysis is an AI-assisted movement support tool and DOES NOT constitute a medical diagnosis. "
    "Please consult your assigned physical therapist for professional clinical evaluation and medical advice."
)

SYSTEM_CLINICAL_GUARDRAIL: str = """
You are an AI Physiotherapy Support Assistant.
CRITICAL SAFETY INSTRUCTIONS:
1. Never diagnose medical conditions, injuries, or pathologies.
2. Never prescribe medications or order medical procedures.
3. Always include recommendations for clinical evaluation by a licensed physical therapist.
4. Keep advice focused on movement ergonomics, form guidance, and recovery encouragement.
"""


def sanitize_pii(text: str) -> str:
    """Redacts potential PII (emails, phone numbers, SSNs) before sending context to AI providers."""
    if not text:
        return ""
    # Redact email addresses
    text = re.sub(r"[\w\.-]+@[\w\.-]+\.\w+", "[REDACTED_EMAIL]", text)
    # Redact phone numbers (digits sequence)
    text = re.sub(r"\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}", "[REDACTED_PHONE]", text)
    return text


def build_posture_analysis_prompt(landmarks: Dict[str, Any], movement_metrics: Dict[str, Any]) -> str:
    return f"""
System Prompt: {SYSTEM_CLINICAL_GUARDRAIL}
Prompt Version: {PROMPT_VERSIONS['posture_analysis']}

Analyze the following pose landmark metrics:
Pose Landmarks: {landmarks}
Movement Metrics: {movement_metrics}

Generate a structured analysis covering:
1. Posture Alignment Assessment (shoulder tilt, pelvic alignment, head tilt angle)
2. Movement Efficiency & Ergonomic Feedback
3. Recommended Form Tweaks
4. Clinical Support Note for Therapist Review
"""


def build_exercise_assistant_prompt(patient_question: str, plan_context: Dict[str, Any]) -> str:
    clean_question = sanitize_pii(patient_question)
    return f"""
System Prompt: {SYSTEM_CLINICAL_GUARDRAIL}
Prompt Version: {PROMPT_VERSIONS['exercise_assistant']}

Patient Question: {clean_question}
Assigned Treatment Plan Context: {plan_context}

Provide a safe, encouraging, and clear response addressing form, rep pacing, or routine guidance.
Do not modify prescribed sets/reps or diagnose pain causes.
"""


def build_progress_summary_prompt(metrics: Dict[str, Any], weekly_records: list[Dict[str, Any]]) -> str:
    return f"""
System Prompt: {SYSTEM_CLINICAL_GUARDRAIL}
Prompt Version: {PROMPT_VERSIONS['progress_summary']}

Weekly Metrics Summary: {metrics}
Progress Records: {weekly_records}

Generate a weekly patient recovery summary highlighting:
1. Key Progress Milestones (Pain reduction, mobility gains)
2. Exercise Consistency & Compliance Score
3. Encouraging Motivation & Next Week Guidance
"""
