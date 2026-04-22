import { useState } from "react";

const fields = [
  { name: "fullName", label: "First Name – Surname", type: "text", required: true, placeholder: "e.g. Priya Sharma" },
  { name: "phone", label: "Mobile Number", type: "text", required: true, placeholder: "e.g. +61 400 000 000" },
  { name: "email", label: "Email Address", type: "text", required: true, placeholder: "e.g. priya@example.com" },
  {
    name: "interest",
    label: "What are you most interested in right now?",
    type: "radio",
    options: ["Business", "Accounting", "IT / Cyber Security", "Not sure yet"],
    required: true,
  },
  {
    name: "situation",
    label: "Which option best describes you?",
    type: "radio",
    options: [
      "I have no idea what to do",
      "I have some ideas but need directions",
      "I know what I want but need a pathway",
    ],
    required: true,
  },
  {
    name: "startTime",
    label: "When are you thinking of starting?",
    type: "radio",
    options: ["ASAP (next intake)", "In a few months", "Just exploring"],
    required: true,
  },
];

const WHATSAPP_NUMBER = "61485669240";
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbywxCLH2MEjdElkXr-LRk-PASKypUbuwEgoNjyGycimTzcL5jbMABZ11l5jPxpVO2xu/exec";

export default function App() {
  const [formData, setFormData] = useState({
    fullName: "", phone: "", email: "", interest: "", situation: "", startTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const { fullName, phone, email, interest, situation, startTime } = formData;

    const payload = JSON.stringify({
      fullName,
      phone,
      email,
      interest,
      situation,
      startTime,
      requestId: Date.now(),
    });

    const blob = new Blob([payload], { type: "text/plain" });
    navigator.sendBeacon(WEBHOOK_URL, blob);

    await new Promise((r) => setTimeout(r, 300));

    const message = `Hi, I just filled the form:\n\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\n\nInterest: ${interest}\nSituation: ${situation}\nStart Time: ${startTime}`;

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#fafafa] to-[#f0fff4] flex flex-col items-center px-4 pt-10 pb-16 relative overflow-hidden font-sans text-slate-800">
      <div className="fixed -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed -bottom-[100px] -left-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="w-full max-w-[440px] animate-fade-up relative z-10">
        <header className="text-center mb-8">
          <div className="inline-block bg-green-500/10 text-green-600 text-[13px] font-semibold px-3.5 py-1.5 rounded-full mb-4 tracking-wide">
            🎓 Study in Australia
          </div>
          <h1 className="font-serif text-[clamp(28px,6vw,38px)] font-bold text-slate-900 leading-[1.2] mb-3.5 tracking-tight">
            Find Your Study Path<br />in Australia
          </h1>
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-[340px] mx-auto">
            Answer a few questions and get personalised guidance — instantly on WhatsApp.
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.08)] p-8 border border-slate-200/80">
          <form onSubmit={handleSubmit} noValidate>
            {fields.map((field) => (
              <div key={field.name} className="mb-6">
                <label className="block text-sm font-semibold text-slate-800 mb-2.5 leading-snug">{field.label}</label>

                {field.type === "text" && (
                  <>
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`w-full p-3 text-[15px] border-[1.5px] rounded-xl outline-none text-slate-800 bg-slate-50 transition-all focus:bg-white focus:ring-[3px] focus:ring-green-500/10 ${
                        errors[field.name] ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-green-500'
                      }`}
                    />
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors[field.name]}</p>}
                  </>
                )}

                {field.type === "radio" && (
                  <>
                    <div className="flex flex-col gap-2.5">
                      {field.options.map((opt) => (
                        <label key={opt} className="radio-group-label">
                          <input
                            type="radio"
                            name={field.name}
                            value={opt}
                            checked={formData[field.name] === opt}
                            onChange={() => handleChange(field.name, opt)}
                            className="sr-only"
                          />
                          <span className="radio-circle"><span className="radio-dot"></span></span>
                          <span className="text-sm text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors[field.name]}</p>}
                  </>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-[15px_24px] bg-gradient-to-br from-green-500 to-green-600 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer mt-2 transition-all shadow-[0_4px_14px_rgba(34,197,94,0.35)] hover:from-green-600 hover:to-green-700 hover:shadow-[0_6px_20px_rgba(34,197,94,0.45)] hover:-translate-y-[1px] disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <span className="flex items-center gap-2.5">
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow"></span>
                  Redirecting to WhatsApp…
                </span>
              ) : (
                <span className="flex items-center gap-2.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Continue to WhatsApp
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-[18px] font-medium">
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
