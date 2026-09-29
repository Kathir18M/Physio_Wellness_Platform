/**
 * Centralized mock data for the PhysioWell public platform.
 */

export interface PainArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  commonSymptoms: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  benefits: string[];
  duration: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  category: "Spine & Posture" | "Athletic Performance" | "Rehabilitation" | "Chronic Pain";
  durationWeeks: number;
  sessionsPerWeek: number;
  description: string;
  keyFeatures: string[];
  suitableFor: string;
  badge: string;
}

export interface ExpertItem {
  id: string;
  name: string;
  role: string;
  qualifications: string;
  experienceYears: number;
  specialties: string[];
  bio: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
}

export interface ClinicItem {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  facilities: string[];
  isHybridAvailable: boolean;
}

export interface TestimonialItem {
  id: string;
  patientName: string;
  age: number;
  condition: string;
  story: string;
  rating: number;
  recoveredInWeeks: number;
  physioAssigned: string;
  avatarUrl?: string;
}

export interface FaqItem {
  id: string;
  category: "General" | "Treatments" | "Online Care" | "Clinics";
  question: string;
  answer: string;
}

export const PAIN_AREAS: PainArea[] = [
  {
    id: "back-spine",
    title: "Lower Back & Spine Pain",
    description: "Targeted decompression, core stabilization, and postural alignment for acute or chronic lumbar distress.",
    icon: "spine",
    commonSymptoms: ["Sciatica radiating down legs", "Stiffness after prolonged sitting", "Disc herniation flare-ups"],
  },
  {
    id: "neck-shoulder",
    title: "Neck & Shoulder Tension",
    description: "Relief from desk-bound posture strain, cervical spondylosis, and rotator cuff stiffness.",
    icon: "shoulder",
    commonSymptoms: ["Tech-neck strain & tension headaches", "Trapezius knots", "Limited overhead shoulder reach"],
  },
  {
    id: "knee-joint",
    title: "Knee & Joint Rehab",
    description: "Post-ACL recovery, osteoarthritis joint mobility, and patellar tracking rehabilitation.",
    icon: "knee",
    commonSymptoms: ["Popping or instability on stairs", "Cartilage wear stiffness", "Post-sports injury swelling"],
  },
  {
    id: "post-surgery",
    title: "Post-Surgical Recovery",
    description: "Structured progressive protocol for joint replacements, ligament repair, and spinal procedures.",
    icon: "surgical",
    commonSymptoms: ["Restricted surgical range of motion", "Post-op muscle atrophy", "Scar tissue tightness"],
  },
  {
    id: "sports-performance",
    title: "Sports & Athletic Recovery",
    description: "Biomechanical gait alignment, hamstring tears, tendonitis, and peak athletic load management.",
    icon: "sports",
    commonSymptoms: ["Repeated strain injuries", "Achilles & shin splints", "Muscle power imbalance"],
  },
  {
    id: "ergonomics",
    title: "Ergonomics & Posture Reset",
    description: "Workstation spine alignment, preventive biomechanics, and daily mobility routine design.",
    icon: "posture",
    commonSymptoms: ["Slouched upper back hump", "Repetitive strain injury (RSI)", "End-of-day fatigue"],
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "virtual-physio",
    title: "Virtual Physiotherapy & Tele-Rehab",
    slug: "virtual-physio",
    shortDescription: "1-on-1 HD video consultations with licensed specialists and real-time exercise correction.",
    fullDescription: "Experience hospital-grade physiotherapy guidance from the comfort of your home. Our tele-rehab sessions combine visual motion evaluation, custom biomechanical analysis, and step-by-step guidance.",
    icon: "video",
    benefits: ["No commute or waiting rooms", "Real-time HD posture guidance", "Digital exercise prescriptions"],
    duration: "45 Min",
  },
  {
    id: "in-clinic-care",
    title: "In-Clinic Hands-On Therapy",
    slug: "in-clinic-care",
    shortDescription: "Manual therapy, joint mobilization, electrotherapy, and physical manipulation at our modern clinics.",
    fullDescription: "Visit our state-of-the-art wellness centers for advanced manual therapy, dry needling, ultrasound therapy, and hands-on spinal manipulation administered by senior physiotherapists.",
    icon: "clinic",
    benefits: ["Advanced electrotherapy equipment", "Hands-on spinal alignment", "Dedicated private treatment suites"],
    duration: "60 Min",
  },
  {
    id: "custom-rehab-plan",
    title: "Personalized Digital Rehab Plans",
    slug: "custom-rehab-plan",
    shortDescription: "Evidence-based multi-week recovery tracks crafted specifically for your diagnosis.",
    fullDescription: "No generic templates. Your physiotherapist designs a dynamic, multi-phase rehabilitation roadmap tailored to your specific biomechanics, pain threshold, and recovery timeline.",
    icon: "plan",
    benefits: ["Structured phase progression", "Daily exercise video guides", "Weekly progress reviews"],
    duration: "Ongoing",
  },
  {
    id: "ergonomic-assessment",
    title: "Corporate Ergonomic Evaluation",
    slug: "ergonomic-assessment",
    shortDescription: "Desk setup audits, spinal posture screenings, and workplace injury prevention programs.",
    fullDescription: "Prevent repetitive strain injuries (RSI) and chronic neck strain across your remote or office workforce with tailored ergonomic assessments and spine health workshops.",
    icon: "desk",
    benefits: ["Individualized workstation setup", "Preventive strain exercises", "Corporate wellness reports"],
    duration: "30-60 Min",
  },
];

export const PROGRAMS: ProgramItem[] = [
  {
    id: "spine-reset",
    title: "Spine & Posture Core Reset",
    slug: "spine-reset",
    category: "Spine & Posture",
    durationWeeks: 6,
    sessionsPerWeek: 3,
    description: "A comprehensive 6-week protocol designed to alleviate chronic lower back stiffness, strengthen deep core stabilizers, and restore natural spinal curvature.",
    keyFeatures: ["Deep core activation routine", "Lumbar decompression techniques", "Ergonomic habit coaching"],
    suitableFor: "Office workers, chronic lower back pain sufferers, and individuals with postural slumping.",
    badge: "Most Popular",
  },
  {
    id: "knee-rehab-mastery",
    title: "Knee Joint & Ligament Recovery",
    slug: "knee-rehab-mastery",
    category: "Rehabilitation",
    durationWeeks: 8,
    sessionsPerWeek: 3,
    description: "Progressive strength and stability training targeting quadriceps balance, patellar tracking, and ACL/meniscus rehabilitation.",
    keyFeatures: ["Proprioception & balance drills", "Patellofemoral tracking correction", "Graduated load management"],
    suitableFor: "Runners, post-knee surgery patients, and individuals experiencing knee stiffness on stairs.",
    badge: "Clinical Proven",
  },
  {
    id: "shoulder-rotator-relief",
    title: "Shoulder Mobility & Rotator Relief",
    slug: "shoulder-rotator-relief",
    category: "Chronic Pain",
    durationWeeks: 5,
    sessionsPerWeek: 2,
    description: "Targeted scapular stabilization and rotator cuff strengthening to eliminate impingement and restore full overhead arm extension.",
    keyFeatures: ["Scapular dyskinesia correction", "Rotator cuff strengthening", "Myofascial shoulder release"],
    suitableFor: "Swimmers, tennis players, desk workers, and individuals with frozen shoulder strain.",
    badge: "Fast Relief",
  },
  {
    id: "athletic-peak-performance",
    title: "Athletic Biomechanics & Peak Mobility",
    slug: "athletic-peak-performance",
    category: "Athletic Performance",
    durationWeeks: 10,
    sessionsPerWeek: 4,
    description: "High-performance kinetic chain optimization designed to prevent recurrent hamstrings/groin strain and enhance explosive movement power.",
    keyFeatures: ["Kinetic chain gait analysis", "Explosive plyometric conditioning", "Preventive tissue release"],
    suitableFor: "Competitive athletes, triathletes, and active fitness enthusiasts seeking peak physical output.",
    badge: "Elite Care",
  },
];

export const EXPERTS: ExpertItem[] = [
  {
    id: "dr-sarah-jenkins",
    name: "Dr. Sarah Jenkins, MPT",
    role: "Lead Musculoskeletal Specialist",
    qualifications: "Master of Physical Therapy (MPT), Orthopedic Certified Specialist (OCS)",
    experienceYears: 12,
    specialties: ["Spine Decompression", "Post-Surgical Knee Rehab", "Dry Needling"],
    bio: "Dr. Jenkins has treated over 3,000 patients with complex spinal conditions. She specializes in non-invasive lumbar recovery and biomechanical alignment.",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewCount: 420,
  },
  {
    id: "dr-marcus-vance",
    name: "Dr. Marcus Vance, DPT",
    role: "Sports Injury & Performance Specialist",
    qualifications: "Doctor of Physical Therapy (DPT), CSCS",
    experienceYears: 10,
    specialties: ["ACL Rehabilitation", "Rotator Cuff Impingement", "Athletic Biomechanics"],
    bio: "Former physical therapist for national athletic teams, Dr. Vance brings elite-level sports recovery techniques to patients of all activity levels.",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewCount: 380,
  },
  {
    id: "dr-elena-rodriguez",
    name: "Dr. Elena Rodriguez, MPT",
    role: "Neurological & Posture Specialist",
    qualifications: "MPT, Ergonomic Certified Specialist (CEAS)",
    experienceYears: 8,
    specialties: ["Cervical Spine Pain", "Workplace Ergonomics", "Postural Realignment"],
    bio: "Passionate about empowering desk workers to live pain-free through habit modification, core re-education, and targeted cervical spine therapy.",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewCount: 290,
  },
];

export const CLINICS: ClinicItem[] = [
  {
    id: "downtown-wellness",
    name: "PhysioWell Central Clinic",
    city: "Downtown Medical District",
    address: "742 Evergreen Health Boulevard, Suite 400",
    phone: "+1 (555) 234-5678",
    hours: "Mon - Sat: 8:00 AM - 7:00 PM",
    facilities: ["Private Therapy Suites", "Motion Analysis Gym", "Electrotherapy Lab", "Hydrotherapy Basin"],
    isHybridAvailable: true,
  },
  {
    id: "westside-sports",
    name: "PhysioWell Sports & Rehab Center",
    city: "Westside Athletic Hub",
    address: "1280 Olympic Parkway, Building B",
    phone: "+1 (555) 876-5432",
    hours: "Mon - Fri: 7:00 AM - 8:00 PM",
    facilities: ["High-Performance Turf", "Isokinetic Strength Rig", "Dry Needling Room", "Recovery Lounge"],
    isHybridAvailable: true,
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    patientName: "Michael Chang",
    age: 42,
    condition: "Severe L4-L5 Lumbar Herniation",
    story: "After suffering from agonizing lower back pain for 9 months, I was considering surgery. PhysioWell's targeted spine program brought me back to 100% mobility without invasive procedures!",
    rating: 5,
    recoveredInWeeks: 6,
    physioAssigned: "Dr. Sarah Jenkins",
  },
  {
    id: "t2",
    patientName: "Amanda Lawson",
    age: 34,
    condition: "Post-ACL Reconstruction",
    story: "The hybrid care model was incredible. I visited the clinic twice a month for hands-on therapy and did daily guided video sessions at home. I ran my first post-op 10k last weekend!",
    rating: 5,
    recoveredInWeeks: 10,
    physioAssigned: "Dr. Marcus Vance",
  },
  {
    id: "t3",
    patientName: "Robert Sterling",
    age: 51,
    condition: "Chronic Desk Posture & Neck Tension",
    story: "As a software architect sitting 10 hours a day, daily headaches were crushing my focus. The posture reset program completely resolved my neck stiffness within 3 weeks.",
    rating: 5,
    recoveredInWeeks: 4,
    physioAssigned: "Dr. Elena Rodriguez",
  },
];

export const FAQS: FaqItem[] = [
  {
    id: "f1",
    category: "General",
    question: "What is PhysioWell and how does it work?",
    answer: "PhysioWell is a modern hybrid physiotherapy platform combining online video consultations with licensed physical therapists, custom digital rehabilitation plans, and optional in-clinic hands-on therapy.",
  },
  {
    id: "f2",
    category: "Online Care",
    question: "Can physiotherapy really be effective online?",
    answer: "Yes! Clinical studies show that guided exercise therapy, postural re-education, and movement assessment are highly effective virtually. Our therapists visually assess your range of motion and guide you through real-time corrections.",
  },
  {
    id: "f3",
    category: "Treatments",
    question: "Do I need a doctor's referral to start therapy?",
    answer: "In most regions, direct access allows you to start physiotherapy immediately without a doctor's referral. If specialized medical imaging (like MRI/X-ray) is needed, our therapists will guide you.",
  },
  {
    id: "f4",
    category: "Clinics",
    question: "Can I combine online tele-rehab with in-clinic visits?",
    answer: "Absolutely! Our hybrid care model allows you to attend hands-on manual therapy at our modern clinics while tracking your recovery and daily exercise progress through your digital portal.",
  },
  {
    id: "f5",
    category: "General",
    question: "How soon can I expect pain relief?",
    answer: "Most patients report noticeable improvement within 2 to 3 weeks of consistent adherence to their customized recovery plan, with acute tension relief often occurring after the first session.",
  },
];
