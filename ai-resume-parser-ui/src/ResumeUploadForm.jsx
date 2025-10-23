import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import * as mammoth from "mammoth";
import { motion, AnimatePresence } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function ResumeUploadForm() {
  const { register, setValue, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      personalMail: "",
      gender: "",
      nationality: "",
      languages: "",
      description: "",
      skills: "",
      qualifications: [],
      workExperiences: [],
    },
  });

  const [uploading, setUploading] = useState(false);
  const [skillsArr, setSkillsArr] = useState([]);
  const watchedSkills = watch("skills");

  // --- Text extraction ---
  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value ?? "";
  };

  const populateFormFromParsed = (data) => {
    const mapped = {
      firstName: data.firstName || "",
      middleName: data.middleName || "",
      lastName: data.lastName || "",
      mobile: data.mobile || "",
      personalMail: data.personalMail || "",
      gender: data.gender || "",
      nationality: data.nationality || "",
      languages:
        typeof data.languages === "string"
          ? data.languages
          : Array.isArray(data.languages)
          ? data.languages.join(", ")
          : "",
      description: data.description || "",
      skills:
        Array.isArray(data.skills) && data.skills.length
          ? data.skills.map((s) => (s.name ? s.name : s)).join(", ")
          : typeof data.skills === "string"
          ? data.skills
          : "",
      qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
      workExperiences: Array.isArray(data.workExperiences) ? data.workExperiences : [],
    };

    Object.entries(mapped).forEach(([k, v]) => setValue(k, v));

    const chips =
      Array.isArray(data.skills) && data.skills.length
        ? data.skills.map((s) => (s.name ? s.name : s))
        : mapped.skills
        ? mapped.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    setSkillsArr(chips);
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    let extractedText = "";

    try {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") extractedText = await extractTextFromPdf(file);
      else if (ext === "docx") extractedText = await extractTextFromDocx(file);
      else throw new Error("Unsupported file type.");

      // Get API URL from runtime config or fallback to Vite env
      const apiUrl = window.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await axios.post(`${apiUrl}/api/resume-parser/parse`, {
        text: extractedText,
      });

      const parsed = res.data;
      if (parsed) populateFormFromParsed(parsed);
    } catch (err) {
      console.error(err);
      alert("Error parsing resume.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addSkillFromInput = () => {
    const text = watchedSkills || "";
    const tokens = text.split(",").map((t) => t.trim()).filter(Boolean);
    const combined = Array.from(new Set([...skillsArr, ...tokens]));
    setSkillsArr(combined);
    setValue("skills", combined.join(", "));
  };

  const removeSkill = (skill) => {
    const updated = skillsArr.filter((s) => s !== skill);
    setSkillsArr(updated);
    setValue("skills", updated.join(", "));
  };

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      skills: skillsArr.map((s) => ({ name: s })),
      qualifications: formData.qualifications,
      workExperiences: formData.workExperiences,
    };
    console.log("Submitting profile payload:", payload);
  };

  const SkillChip = ({ skill }) => (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm mr-2 mb-2"
    >
      <span className="mr-2">{skill}</span>
      <button
        type="button"
        onClick={() => removeSkill(skill)}
        className="text-blue-700 hover:text-red-500"
        aria-label={`Remove ${skill}`}
      >
        ✕
      </button>
    </motion.span>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-3xl shadow-xl relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-50 to-blue-100 opacity-30"
        animate={{ x: [-50, 50, -50] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 relative z-10">
        AI Resume Parser — Preview & Edit
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative z-10">
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Upload Resume (PDF / DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={onUpload}
            className="mb-2 w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-blue-600 flex items-center gap-2 mt-2"
              >
                <div className="w-5 h-5 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Parsing resume…</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
          <p className="text-sm text-gray-600 font-medium">Quick actions</p>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                reset();
                setSkillsArr([]);
              }}
              className="w-full bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["firstName", "lastName", "mobile", "personalMail", "gender", "nationality"].map((f) => (
            <input
              key={f}
              {...register(f)}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              className="border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 p-3 rounded shadow-sm"
            />
          ))}
        </section>

        <section>
          <label className="block text-sm font-semibold mb-2">Profile Summary</label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Short professional summary"
            className="w-full border border-gray-300 p-3 rounded shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </section>

        <section>
          <label className="block text-sm font-semibold mb-2">Languages</label>
          <input
            {...register("languages")}
            placeholder="English, Marathi, Hindi, etc."
            className="border border-gray-300 p-2 rounded w-full shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </section>

        <section>
          <label className="block text-sm font-semibold mb-2">Skills</label>
          <div className="flex gap-2 mb-3">
            <input
              {...register("skills")}
              placeholder="e.g. React, Node, Kafka"
              className="border border-gray-300 p-2 rounded flex-1 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={addSkillFromInput}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>

          <div className="mb-2 flex flex-wrap">
            <AnimatePresence>
              {skillsArr.length === 0 ? (
                <p className="text-sm text-gray-400">No skills detected yet</p>
              ) : (
                skillsArr.map((s) => <SkillChip key={s} skill={s} />)
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Qualifications & Work Experience UI remains similar, just upgraded styling */}
        {/* You can add AnimatePresence + motion.div for smooth entry/exit animation */}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setValue("skills", skillsArr.join(", "))}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Sync
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-blue rounded shadow hover:bg-green-700 transition"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
