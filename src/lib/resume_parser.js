import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const LoadResume = async (resume) => {
  let text = "";

  if (typeof resume === "string") {
    text = resume;
  } else if (resume instanceof File) {
    text = await resume.text();
  } else if (resume instanceof Blob) {
    text = await resume.text();
  } else {
    throw new Error("Resume must be a File, Blob, or text string");
  }

  return new Resume(text);
};

export class Resume {
  text;
  constructor(text) {
    this.text = text;
  }

  async extractJson() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error(
          "VITE_GEMINI_API_KEY is not set in environment variables"
        );
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
      You are an information extraction engine.

      Extract structured data from a raw resume text, calculate an ATS score, and return ONLY one valid JSON document matching the schema below.

      🎯 Target JSON Schema (STRICT)
      {
        "resume": {
          "socials": [
            { "name": "", "url": "" }
          ],
          "education": [
            {
              "eduType": "",
              "instituteName": "",
              "course": "",
              "score": 0,
              "isCGPA": false,
              "yearOfComp": 0
            }
          ],
          "certifications": [
            {
              "name": "",
              "provider": "",
              "url": "",
              "yearOfComp": 0
            }
          ],
          "experience": [
            {
              "jobTitle": "",
              "jobDesc": "",
              "months": 0
            }
          ],
          "atsScore": 0,
          "skills": [""]
        },
        "address": {
          "line": "",
          "city": "",
          "state": "",
          "pinCode": "",
          "country": ""
        },
        "dateOfBirth": "",
        "totalExperienceDuration": 0
      }

      🔒 Mandatory Rules

      Output ONLY valid JSON

      ❌ No markdown, explanations, or extra text

      ❌ No extra fields

      Missing values:

      string → ""

      number → 0

      boolean → false

      array → []

      Numbers must be numbers, not strings

      Never guess or hallucinate data

      📌 Field Rules

      Socials

      name ∈ leetcode | linkedin | github | others

      If platform present but URL missing → don't add that social media to the array

      If the url contains scheme of the protocol (eg. 'http://', 'https://') remove that from the actual url string

      Education

      eduType ∈ SSC | HSC | UG | PG | Diploma

      Percentage → isCGPA: false

      CGPA → isCGPA: true

      Experience

      Only professional jobs

      ❌ Exclude projects, hackathons, academics

      Skills

      MongoDB Array of strings

      Normalize casing, remove duplicates

      totalExperienceDuration → years (number), else 0

      📊 ATS Score (0–100)

      Evaluate the resume and compute an ATS score from 0–100, storing the result in resume.atsScore.

      Use these weights and calibration:

      Skills & Keyword Match — 30
        - Match of technical, role, and tool keywords vs job requirements.

      Relevant Experience & Projects — 25
        - Include internships, academic projects, and personal projects as valid experience, especially for entry-level roles.

      Role Fit & Impact — 15
        - Quality of projects, responsibilities, outcomes, and problem-solving.

      Resume Completeness & Structure — 15
        - Presence of summary, skills, projects/experience, education, contact info, clean formatting.

      Education — 10
        - Degree relevance, academic performance, institution credibility.

      Certifications — 5
        - Relevance and quality.

      Scoring calibration:

      Strong entry-level resumes should score 75–85

      Excellent profiles should reach 85–95

      Avoid compressing most candidates into 50–65

      Final ATS Score = sum of all sections (0–100).

      Rules:

      Integer only

      Max 100

      No explanation

      📊 Address

      Stores following object in address key

      1. line: actual address (eg. house number, landmark, etc.)
      2. city: stores name of the city
      3. state: stores the name of the state mentioned in the Resume
      4. pinCode: stores the zip code of the candidate mentioned in the Resume
      5. country: stores the name of the country the candidate has mentioned on the resume

      Rules:

      Address should store only the address of the resume holder.
      If address is not provided on the resume, it should be initialized with empty string (eg. "address.line" = "")

      🔽 Input

      You will receive raw resume text.
      Extract data, calculate ATS, and return JSON only.
      NOTE: DO NOT ADD MARKDOWN CODE FENCE

TEXT:
`;

      const result = await model.generateContent(prompt + this.text);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from AI model");
      }

      const cleanedText = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const parsedJson = JSON.parse(cleanedText);

      // Save to Firebase Firestore
      await this.saveToFirebase(parsedJson);

      return parsedJson;
    } catch (err) {
      console.error("Error extracting resume data:", err);
      throw new Error(
        `Failed to extract resume data: ${err.message || "Unknown error"}`
      );
    }
  }

  async saveToFirebase(resumeData) {
    try {
      const resumesCollection = collection(db, "resumes");
      const docRef = await addDoc(resumesCollection, {
        ...resumeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Resume saved to Firebase with ID:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Error saving resume to Firebase:", err);
      // Don't throw - allow extraction to succeed even if Firebase save fails
    }
  }

  async getFromFirebaseByScore(minScore = 0) {
    try {
      const resumesCollection = collection(db, "resumes");
      const q = query(
        resumesCollection,
        where("resume.atsScore", ">=", minScore)
      );
      const querySnapshot = await getDocs(q);
      const resumes = [];
      querySnapshot.forEach((doc) => {
        resumes.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return resumes;
    } catch (err) {
      console.error("Error fetching resumes from Firebase:", err);
      return [];
    }
  }

  getText() {
    return this.text;
  }
}
