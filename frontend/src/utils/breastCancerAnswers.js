/**
 * Educational breast cancer information helper (not medical advice).
 * Matches user text to topics; falls back to a general supportive reply.
 */

const TOPICS = [
  {
    keys: ["symptom", "sign", "feel", "notice", "change in breast"],
    reply:
      "Common breast cancer signs include a new lump or thickening, nipple discharge (especially bloody), nipple inversion, skin dimpling or redness, breast or armpit swelling, or a change in size or shape. Many changes are benign, but any new or persistent finding should be checked by a clinician.",
  },
  {
    keys: ["lump", "mass", "bump"],
    reply:
      "Not all lumps are cancer, but a new or growing lump should be evaluated. Your doctor may suggest imaging (ultrasound, mammogram) and sometimes a biopsy. Do not delay if the lump is hard, fixed, painless, or growing.",
  },
  {
    keys: ["pain", "hurt", "sore", "tender"],
    reply:
      "Breast pain is common and often linked to hormones, cysts, or muscle strain—not always cancer. Persistent focal pain or pain with a lump or skin change still deserves a medical review.",
  },
  {
    keys: ["nipple", "discharge"],
    reply:
      "Nipple discharge can have many causes. Bloody or spontaneous discharge from one duct should be assessed promptly. Clear or milky discharge can also need evaluation depending on age and other symptoms.",
  },
  {
    keys: ["self exam", "self-exam", "breast exam", "check myself"],
    reply:
      "Know how your breasts normally look and feel. Monthly self-awareness (and optional self-exam) can help you notice changes early. Combine this with clinical breast exams and screening tests as your doctor recommends.",
  },
  {
    keys: ["mammogram", "screening", "x-ray breast"],
    reply:
      "Mammography is a key screening tool for many women. How often to screen depends on age, risk, and guidelines in your region. Discuss the right schedule with your doctor, especially if you have family history or dense breasts.",
  },
  {
    keys: ["ultrasound", "dense breast"],
    reply:
      "Ultrasound can complement mammograms, especially in dense breast tissue. If you have dense breasts, ask your care team about additional screening options appropriate for you.",
  },
  {
    keys: ["biopsy", "needle", "pathology"],
    reply:
      "A biopsy takes a small tissue sample to see if cells are cancerous. Results guide the next steps. Waiting for results can be stressful—reach out to your team or support resources if you need help coping.",
  },
  {
    keys: ["stage", "staging"],
    reply:
      "Stage describes how far cancer has spread (tumor size, lymph nodes, distant spread). It helps guide treatment choices and prognosis. Your oncologist will explain your stage and what it means for your plan.",
  },
  {
    keys: ["dcis", "ductal carcinoma in situ"],
    reply:
      "DCIS is non-invasive cancer cells inside milk ducts. It is treated to reduce the chance of invasive cancer. Options may include surgery, sometimes radiation or hormone therapy—your team will tailor this.",
  },
  {
    keys: ["invasive", "infiltrating"],
    reply:
      "Invasive breast cancer means cells have grown into nearby breast tissue. Treatment often combines local therapy (surgery, radiation) and systemic therapy when needed (chemotherapy, hormone, or targeted drugs).",
  },
  {
    keys: ["her2", "triple negative", "er positive", "pr positive", "hormone receptor"],
    reply:
      "Tumor tests (ER, PR, HER2) show which treatments may work. Hormone-positive cancers may use hormone therapy. HER2-positive cancers may use targeted drugs. Triple-negative cancers often use chemotherapy—your report guides the plan.",
  },
  {
    keys: ["chemo", "chemotherapy"],
    reply:
      "Chemotherapy uses drugs to kill or slow cancer cells. Side effects vary (fatigue, nausea, hair loss, infection risk). Your team can help manage side effects and adjust doses when needed.",
  },
  {
    keys: ["radiation", "radiotherapy"],
    reply:
      "Radiation targets the breast or chest wall after surgery to reduce recurrence risk. Sessions are usually daily over several weeks. Skin irritation and fatigue are common but temporary for many people.",
  },
  {
    keys: ["surgery", "lumpectomy", "mastectomy", "breast conserving"],
    reply:
      "Surgery options include breast-conserving surgery (lumpectomy) plus radiation, or mastectomy, depending on tumor size, location, and preference. Lymph nodes may be checked with sentinel biopsy or dissection.",
  },
  {
    keys: ["reconstruction", "implant", "flap"],
    reply:
      "Breast reconstruction can happen at the same time as mastectomy or later. Options include implants or tissue from your body. A plastic surgeon can discuss timing, risks, and recovery.",
  },
  {
    keys: ["side effect", "nausea", "fatigue", "hair loss"],
    reply:
      "Treatment side effects are common and often manageable. Tell your team early about symptoms—there are medicines and supportive care for nausea, pain, fatigue, and more. Do not stop treatment without medical advice.",
  },
  {
    keys: ["lymphedema", "swelling arm"],
    reply:
      "Lymphedema is arm swelling after lymph node surgery or radiation. Gentle exercise, compression, and specialist therapy can help. Ask for a referral if you notice persistent arm or chest swelling.",
  },
  {
    keys: ["recurrence", "come back", "return"],
    reply:
      "Recurrence means cancer appears again after treatment. Follow-up visits and sometimes imaging help monitor. New symptoms should be reported promptly. Many people live well with long-term treatment when needed.",
  },
  {
    keys: ["metastasis", "metastatic", "spread", "stage 4"],
    reply:
      "Metastatic breast cancer has spread beyond the breast. Treatment focuses on controlling disease and quality of life, often with hormone therapy, chemotherapy, or targeted drugs. Care is individualized and evolving—oncology teams can explain options including trials.",
  },
  {
    keys: ["brca", "genetic", "mutation", "family history"],
    reply:
      "Some breast cancers run in families. Genetic counseling may be advised if you have strong family history or certain ancestries. BRCA and other genes can change screening and prevention choices.",
  },
  {
    keys: ["risk", "prevent", "reduce risk"],
    reply:
      "Risk factors include age, family history, certain gene mutations, dense breasts, hormone exposure, and lifestyle. Healthy weight, limited alcohol, and activity may lower risk somewhat. Screening and risk assessment tools help personalize advice.",
  },
  {
    keys: ["pregnancy", "pregnant", "breastfeeding"],
    reply:
      "Breast cancer during or after pregnancy needs specialized care. Some treatments can be adjusted around pregnancy. Breastfeeding decisions depend on your situation—your OB and oncology team should coordinate.",
  },
  {
    keys: ["menopause", "hrt", "hormone replacement"],
    reply:
      "Menopause and hormone therapy (HRT) can affect breast cancer risk depending on type and duration. If you have or had breast cancer, discuss HRT only with your oncologist—general rules may not apply to you.",
  },
  {
    keys: ["diet", "food", "alcohol", "exercise", "lifestyle"],
    reply:
      "A balanced diet, regular activity, and limiting alcohol support overall health and may help with treatment tolerance. They are not a substitute for medical treatment, but they complement your care plan.",
  },
  {
    keys: ["emotion", "anxiety", "depress", "scared", "stress", "support"],
    reply:
      "A breast cancer diagnosis affects mental health for many people. Counseling, support groups, peer programs, and trusted friends can help. Ask your hospital about psycho-oncology or social work services.",
  },
  {
    keys: ["second opinion", "another doctor"],
    reply:
      "A second opinion is reasonable, especially for major treatment decisions. Many centers offer remote consults. Bring records and imaging so another team can give informed advice.",
  },
  {
    keys: ["clinical trial", "research study"],
    reply:
      "Trials test new therapies and may offer access to promising options. Ask whether any trials fit your cancer type and stage. Participation is voluntary and closely monitored.",
  },
  {
    keys: ["prognosis", "survival", "how long", "curable"],
    reply:
      "Prognosis depends on cancer type, stage, biology, and treatment response—only your care team can interpret that for you. Many people do very well with early-stage disease; advanced disease is often treatable for long periods.",
  },
  {
    keys: ["urgent", "emergency", "er", "severe"],
    reply:
      "Seek urgent care for high fever during chemo, chest pain, sudden shortness of breath, uncontrolled bleeding, or rapidly worsening swelling or infection. For new breast symptoms that are not emergencies, still book prompt medical review.",
  },
  {
    keys: ["hello", "hi", "hey", "thanks", "thank you"],
    reply:
      "Hello. I am Nivara’s breast cancer information assistant. Ask me anything about symptoms, screening, treatment types, side effects, emotional support, or follow-up. I share general education only—always confirm with your doctor.",
  },
  {
    keys: ["mri", "pet scan", "imaging test"],
    reply:
      "Beyond mammograms, MRI or other scans may be used for high-risk screening, dense breasts, or evaluating extent of disease. Your team chooses tests based on your situation—not everyone needs every scan.",
  },
  {
    keys: ["oncologist", "breast surgeon", "radiation oncologist"],
    reply:
      "Breast cancer care often involves several specialists: breast surgeons, medical oncologists, radiation oncologists, radiologists, and nurses. They work together on a coordinated plan tailored to you.",
  },
  {
    keys: ["immunotherapy", "targeted therapy", "cdk"],
    reply:
      "Some breast cancers benefit from targeted therapies that attack specific proteins (like HER2) or pathways. Immunotherapy plays a smaller role for most breast cancers but is an active research area—ask your oncologist what applies to your tumor type.",
  },
];

const DEFAULT_REPLY =
  "I focus on breast cancer education. Your question may be broad—here is general guidance: keep a record of symptoms and medicines, follow your oncology team’s plan, and ask them about anything that worries you. " +
  "I can explain topics like symptoms and lumps, mammograms and biopsies, surgery, chemotherapy, radiation, hormone and targeted therapy, genetics, recurrence, metastatic disease, side effects, emotional support, and lifestyle. " +
  "This is not a diagnosis or personal medical advice; please speak with a qualified clinician for decisions about your care.";

export function getBreastCancerReply(text) {
  const q = text.toLowerCase().trim();
  if (!q) return DEFAULT_REPLY;

  for (const topic of TOPICS) {
    if (topic.keys.some((k) => q.includes(k))) return topic.reply;
  }

  // Light fuzzy match: any word overlap with longer key phrases
  const words = q.split(/\s+/).filter((w) => w.length > 3);
  for (const topic of TOPICS) {
    for (const key of topic.keys) {
      const parts = key.split(/\s+/);
      if (parts.some((p) => p.length > 3 && words.includes(p))) return topic.reply;
    }
  }

  return DEFAULT_REPLY;
}

export const FAQ_STARTERS = [
  "What are common symptoms of breast cancer?",
  "How does screening and mammography work?",
  "What is the difference between chemotherapy and hormone therapy?",
  "What should I know about family history and genetics?",
];
