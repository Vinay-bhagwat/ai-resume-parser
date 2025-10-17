export const queryPrompt= `Extract the following fields from this resume text and return ONLY valid JSON matching this structure:

{
  "firstName": string | null,
  "middleName": string | null,
  "lastName": string | null,
  "gender": string | null,
  "dateOfBirth": string | null,
  "nationality": string | null,
  "mobile": string | null,
  "alternateMobile": string | null,
  "personalMail": string | null,
  "languages": string | null,
  "description": string | null,
  "skills": [{ "name": string }],
  "qualifications": [{ "degree": string, "institution": string, "year": string | null }],
  "workExperiences": [
    { "company": string, "role": string, "duration": string | null, "description": string | null }
  ],
  "certifications": [{ "name": string, "year": string | null }],
  "awards": [{ "name": string, "year": string | null }],
  "localAddress": { "line1": string, "city": string, "state": string, "country": string, "pincode": string },
  "permanentAddress": { "line1": string, "city": string, "state": string, "country": string, "pincode": string }
}

Resume Text:`