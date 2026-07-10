'use client';

import { useState, useRef } from 'react';

export default function ResumeUpload({ onBack, onContinue }) {
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const resumeInputRef = useRef(null);
  const certsInputRef = useRef(null);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your resume.');
        return;
      }
      setResume(file);
    }
  };

  const handleCertsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setCertificates((prev) => [...prev, ...files]);
    }
  };

  const removeResume = () => {
    setResume(null);
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const removeCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
    if (certsInputRef.current) certsInputRef.current.value = '';
  };

  const handleNext = () => {
    if (resume) {
      setIsParsing(true);
      // Mock resume parser delay
      // TODO: Connect actual resume parsing API route here later
      setTimeout(() => {
        setIsParsing(false);
        onContinue(resume, certificates, true); // true = dummyParsed
      }, 1500);
    } else {
      onContinue(null, certificates, false);
    }
  };

  return (
    <div className="glass-panel w-full max-w-[540px] rounded-[24px] p-8 animate-fade-up relative overflow-hidden flex flex-col">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm"
        id="upload-back-btn"
        disabled={isParsing}
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back
      </button>

      <div className="text-center mt-6 mb-6">
        <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Upload your credentials</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[420px] mx-auto">
          Upload your resume and we'll pre-fill details for you — or skip and answer a few quick questions instead.
        </p>
      </div>

      <div className="space-y-6 flex-grow">
        {/* RESUME UPLOAD */}
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm font-semibold text-on-surface-variant ml-1">
            Resume (PDF - Optional)
          </label>
          
          {!resume ? (
            <div 
              onClick={() => resumeInputRef.current?.click()}
              className="border-2 border-dashed border-glass-border hover:border-primary/50 hover:bg-glass-overlay/20 rounded-[16px] p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px]"
            >
              <span className="material-symbols-outlined text-primary text-[32px] mb-2">cloud_upload</span>
              <p className="font-body-md text-sm text-on-surface">Drag & drop or <span className="text-primary font-bold">browse</span></p>
              <p className="font-label-sm text-[11px] text-on-surface-variant mt-1">Supports PDF up to 5MB</p>
              <input 
                ref={resumeInputRef}
                type="file" 
                accept=".pdf" 
                onChange={handleResumeChange} 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-[14px] bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">description</span>
                <div className="max-w-[300px]">
                  <p className="font-body-md text-sm text-on-surface font-semibold truncate">{resume.name}</p>
                  <p className="font-label-sm text-[11px] text-on-surface-variant">{(resume.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                </div>
              </div>
              <button 
                onClick={removeResume}
                className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-glass-overlay transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          )}
        </div>

        {/* CERTIFICATES UPLOAD */}
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm font-semibold text-on-surface-variant ml-1">
            Certificates (Optional, Multi-file)
          </label>

          <div 
            onClick={() => certsInputRef.current?.click()}
            className="border-2 border-dashed border-glass-border hover:border-primary/50 hover:bg-glass-overlay/20 rounded-[16px] p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px]"
          >
            <span className="material-symbols-outlined text-on-surface-variant/70 text-[24px] mb-1">workspace_premium</span>
            <p className="font-body-md text-sm text-on-surface">Upload certificates</p>
            <p className="font-label-sm text-[11px] text-on-surface-variant">Images or PDF</p>
            <input 
              ref={certsInputRef}
              type="file" 
              multiple 
              accept=".pdf,image/*" 
              onChange={handleCertsChange} 
              className="hidden" 
            />
          </div>

          {certificates.length > 0 && (
            <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 mt-2">
              {certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-[12px] bg-glass-overlay border border-glass-border">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">verified</span>
                    <span className="font-body-md text-xs text-on-surface truncate">{cert.name}</span>
                  </div>
                  <button 
                    onClick={() => removeCertificate(index)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-8 h-12 gap-4">
        {!resume ? (
          <button
            onClick={handleNext}
            className="text-on-surface-variant hover:text-primary font-body-md text-sm font-semibold transition-colors"
            type="button"
            id="upload-skip-btn"
          >
            Skip for now
          </button>
        ) : (
          <div></div> // Spacer
        )}

        <button
          onClick={handleNext}
          disabled={isParsing}
          className="btn-primary px-8 h-full rounded-[14px] font-headline-md text-body-md font-semibold flex items-center justify-center gap-2"
          id="upload-continue-btn"
        >
          {isParsing ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Parsing resume...</span>
            </div>
          ) : (
            <>
              Continue
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
