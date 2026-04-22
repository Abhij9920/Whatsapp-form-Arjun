import { useState } from "react";

const WHATSAPP_NUMBER = "61476997621";
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwBP3lngeJ4Bz5JIqaZ9bjsMvsIa22lZ5Bwst3kzjkGwijCzA_ikgAkoKpZdq1hfJjh/exec";

const steps = [
  {
    id: "personal",
    title: "Personal Details",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. Priya Sharma" },
      { name: "dob", label: "Date of Birth / Age", type: "text", required: true, placeholder: "e.g. 15/03/2000 or 24 years old" },
      { name: "nationality", label: "Nationality", type: "text", required: true, placeholder: "e.g. Indian" },
      { name: "country", label: "Country of Current Residence", type: "text", required: true, placeholder: "e.g. India" },
      { name: "email", label: "Email Address", type: "text", required: true, placeholder: "e.g. priya@example.com" },
      { name: "phone", label: "Phone Number", type: "text", required: true, placeholder: "e.g. +91 98765 43210" },
    ],
  },
  {
    id: "education",
    title: "Education Background",
    fields: [
      {
        name: "qualification",
        label: "Highest Qualification Completed",
        type: "radio",
        required: true,
        options: ["High School / Year 12", "Diploma", "Bachelor", "Master", "Other"],
      },
      { name: "fieldOfStudy", label: "Field of Study", type: "text", required: false, placeholder: "e.g. Commerce, IT, Engineering" },
      {
        name: "currentlyStudying",
        label: "Are you currently studying?",
        type: "radio",
        required: true,
        options: ["Yes", "No"],
      },
      { name: "currentCourse", label: "If yes — Course & Institution", type: "text", required: false, placeholder: "e.g. B.Com at Mumbai University" },
    ],
  },
  {
    id: "english",
    title: "English & Academic Readiness",
    fields: [
      {
        name: "englishTest",
        label: "Have you taken an English test?",
        type: "radio",
        required: true,
        options: ["IELTS", "PTE", "TOEFL", "None"],
      },
      { name: "englishScore", label: "Overall Score (if applicable)", type: "text", required: false, placeholder: "e.g. 6.5" },
    ],
  },
  {
    id: "australia",
    title: "Australia Study Status",
    fields: [
      {
        name: "inAustralia",
        label: "Are you currently in Australia?",
        type: "radio",
        required: true,
        options: ["Yes", "No"],
      },
      {
        name: "visaType",
        label: "If YES — What is your visa type?",
        type: "radio",
        required: false,
        options: ["Student Visa", "Visitor Visa", "Other"],
      },
      {
        name: "previousAusEducation",
        label: "Do you have previous Australian education?",
        type: "radio",
        required: true,
        options: ["Yes", "No"],
      },
    ],
  },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", nationality: "", country: "", email: "", phone: "",
    qualification: "", fieldOfStudy: "", currentlyStudying: "", currentCourse: "",
    englishTest: "", englishScore: "",
    inAustralia: "", visaType: "", previousAusEducation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const validate = (fields) => {
    const newErrors = {};
    fields.forEach((f) => {
      if (f.required && !formData[f.name]) {
        newErrors[f.name] = "This field is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleNext = () => {
    if (!validate(step.fields)) return;
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validate(step.fields)) return;
    setLoading(true);

    const payload = JSON.stringify({ ...formData, requestId: Date.now() });
    const blob = new Blob([payload], { type: "text/plain" });
    navigator.sendBeacon(WEBHOOK_URL, blob);

    await new Promise((r) => setTimeout(r, 300));

    const msg = `Hi! I just filled the International Student Pre-Assessment Form:

👤 Name: ${formData.fullName}
🎂 DOB/Age: ${formData.dob}
🌍 Nationality: ${formData.nationality}
📍 Country: ${formData.country}
📧 Email: ${formData.email}
📞 Phone: ${formData.phone}

🎓 Qualification: ${formData.qualification}
📚 Field of Study: ${formData.fieldOfStudy || "N/A"}
📖 Currently Studying: ${formData.currentlyStudying}${formData.currentCourse ? ` — ${formData.currentCourse}` : ""}

🗣️ English Test: ${formData.englishTest}${formData.englishScore ? ` (Score: ${formData.englishScore})` : ""}

🇦🇺 In Australia: ${formData.inAustralia}${formData.visaType ? ` — ${formData.visaType}` : ""}
🏫 Previous Aus Education: ${formData.previousAusEducation}`;

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#fafafa] to-[#f0fff4] flex flex-col items-center px-4 pt-10 pb-16 relative overflow-hidden font-sans text-slate-800">
      <div className="fixed -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed -bottom-[100px] -left-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <header className="text-center mb-8">
          <div className="inline-block bg-green-500/10 text-green-600 text-[13px] font-semibold px-3.5 py-1.5 rounded-full mb-4 tracking-wide">
            🎓 Study in Australia
          </div>
          <h1 className="font-serif text-[clamp(26px,6vw,36px)] font-bold text-slate-900 leading-[1.2] mb-3 tracking-tight">
            International Student<br />Pre-Assessment
          </h1>
          <p className="text-[14px] text-slate-500 leading-relaxed max-w-[340px] mx-auto">
            Complete this quick form and get personalised guidance — instantly on WhatsApp.
          </p>
        </header>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-green-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.08)] p-8 border border-slate-200/80">
          <div className="mb-6">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">
              Step {currentStep + 1} of {steps.length}
            </p>
            <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
          </div>

          <div>
            {step.fields.map((field) => (
              <div key={field.name} className="mb-5">
                <label className="block text-sm font-semibold text-slate-800 mb-2 leading-snug">
                  {field.label}
                  {!field.required && <span className="text-slate-400 font-normal ml-1">(optional)</span>}
                </label>

                {field.type === "text" && (
                  <>
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`w-full p-3 text-[15px] border-[1.5px] rounded-xl outline-none text-slate-800 bg-slate-50 transition-all focus:bg-white focus:ring-[3px] focus:ring-green-500/10 ${
                        errors[field.name] ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-green-500"
                      }`}
                    />
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors[field.name]}</p>}
                  </>
                )}

                {field.type === "radio" && (
                  <>
                    <div className="flex flex-col gap-2">
                      {field.options.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-xl border-[1.5px] cursor-pointer transition-all ${
                            formData[field.name] === opt
                              ? "border-green-500 bg-green-50"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={opt}
                            checked={formData[field.name] === opt}
                            onChange={() => handleChange(field.name, opt)}
                            className="sr-only"
                          />
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            formData[field.name] === opt ? "border-green-500" : "border-slate-300"
                          }`}>
                            {formData[field.name] === opt && (
                              <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                            )}
                          </span>
                          <span className="text-sm text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors[field.name]}</p>}
                  </>
                )}
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 p-[13px_20px] border-[1.5px] border-slate-200 text-slate-600 rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  ← Back
                </button>
              )}

              {!isLast ? (
                <button
                  onClick={handleNext}
                  className="flex-1 p-[13px_20px] bg-gradient-to-br from-green-500 to-green-600 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer transition-all shadow-[0_4px_14px_rgba(34,197,94,0.35)] hover:from-green-600 hover:to-green-700 hover:shadow-[0_6px_20px_rgba(34,197,94,0.45)] hover:-translate-y-[1px]"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 p-[13px_20px] bg-gradient-to-br from-green-500 to-green-600 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer transition-all shadow-[0_4px_14px_rgba(34,197,94,0.35)] hover:from-green-600 hover:to-green-700 hover:shadow-[0_6px_20px_rgba(34,197,94,0.45)] hover:-translate-y-[1px] disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Redirecting…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Continue to WhatsApp
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5 font-medium">
            🔒 Your details are safe and will only be used to guide you.
          </p>
        </div>

        <footer className="text-center mt-7 text-xs text-slate-400">
          <p>© 2025 · Powered by expert education guidance</p>
        </footer>
      </div>
    </div>
  );
}
