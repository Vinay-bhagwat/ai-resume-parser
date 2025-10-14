import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export default function ResumeUploadForm() {
  const { register, setValue, handleSubmit } = useForm();
  const [uploading, setUploading] = useState(false);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('http://localhost:3000/resume-parser/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const data = res.data;
    if (data) {
      // Auto-fill form
      for (const key in data) {
        if (data.hasOwnProperty(key)) setValue(key, data[key]);
      }
    }
    setUploading(false);
  };

  const onSubmit = (data) => {
    console.log('Final Submitted Data:', data);
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Resume Parser</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={onUpload}
        className="mb-4 w-full border p-2 rounded"
      />
      {uploading && <p className="text-blue-500">Parsing resume...</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('Full Name')} placeholder="Full Name" className="border p-2 w-full rounded" />
        <input {...register('Email')} placeholder="Email" className="border p-2 w-full rounded" />
        <input {...register('Phone Number')} placeholder="Phone" className="border p-2 w-full rounded" />
        <textarea {...register('Skills')} placeholder="Skills" className="border p-2 w-full rounded" />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
