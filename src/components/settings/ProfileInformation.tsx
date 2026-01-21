"use client"

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function ProfileInformation() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || "",
    title: "",
    bio: "",
    hourlyRate: "",
    location: "",
    timezone: "",
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [languages, setLanguages] = useState<Array<{ language: string; proficiency: string }>>([]);
  const [education, setEducation] = useState<Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>>([]);

  const [experience, setExperience] = useState<Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>>([]);

  const [portfolio, setPortfolio] = useState<Array<{
    title: string;
    description: string;
    url: string;
    imageUrl: string;
  }>>([]);

  const [certifications, setCertifications] = useState<Array<{
    name: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
  }>>([]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to save profile data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: "" }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: ""
    }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience([...experience, {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: ""
    }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addPortfolio = () => {
    setPortfolio([...portfolio, {
      title: "",
      description: "",
      url: "",
      imageUrl: ""
    }]);
  };

  const removePortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      name: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: ""
    }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving} className="bg-foreground hover:bg-gray-800">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Avatar Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-gray-200">
              <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || ''} />
              <AvatarFallback className="bg-[#0CF574] text-foreground font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
            {user?.role === 'client' ? 'Client' : 'Freelancer'}
          </div>
        </div>

        {/* Professional Title (Freelancers only) */}
        {user?.role === 'freelancer' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., Full Stack Developer, UI/UX Designer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        )}

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            rows={4}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Hourly Rate (Freelancers only) */}
        {user?.role === 'freelancer' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                disabled={!isEditing}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        )}

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            disabled={!isEditing}
            placeholder="City, Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Timezone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="">Select timezone</option>
            <option value="UTC-12:00">UTC-12:00</option>
            <option value="UTC-11:00">UTC-11:00</option>
            <option value="UTC-10:00">UTC-10:00</option>
            <option value="UTC-09:00">UTC-09:00</option>
            <option value="UTC-08:00">UTC-08:00</option>
            <option value="UTC-07:00">UTC-07:00</option>
            <option value="UTC-06:00">UTC-06:00</option>
            <option value="UTC-05:00">UTC-05:00</option>
            <option value="UTC-04:00">UTC-04:00</option>
            <option value="UTC-03:00">UTC-03:00</option>
            <option value="UTC-02:00">UTC-02:00</option>
            <option value="UTC-01:00">UTC-01:00</option>
            <option value="UTC+00:00">UTC+00:00</option>
            <option value="UTC+01:00">UTC+01:00</option>
            <option value="UTC+02:00">UTC+02:00</option>
            <option value="UTC+03:00">UTC+03:00</option>
            <option value="UTC+04:00">UTC+04:00</option>
            <option value="UTC+05:00">UTC+05:00</option>
            <option value="UTC+05:45">UTC+05:45 (Nepal)</option>
            <option value="UTC+06:00">UTC+06:00</option>
            <option value="UTC+07:00">UTC+07:00</option>
            <option value="UTC+08:00">UTC+08:00</option>
            <option value="UTC+09:00">UTC+09:00</option>
            <option value="UTC+10:00">UTC+10:00</option>
            <option value="UTC+11:00">UTC+11:00</option>
            <option value="UTC+12:00">UTC+12:00</option>
          </select>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Social Links</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              disabled={!isEditing}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              disabled={!isEditing}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              disabled={!isEditing}
              placeholder="https://twitter.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>
      </Card>

      {/* Skills (Freelancers only) */}
      {user?.role === 'freelancer' && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
          
          {isEditing && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
              />
              <Button onClick={addSkill} type="button">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-[#0CF574]/20 text-gray-900 rounded-full flex items-center gap-2"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500">No skills added yet</p>
            )}
          </div>
        </Card>
      )}

      {/* Languages */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Languages</h2>
          {isEditing && (
            <Button onClick={addLanguage} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {languages.map((lang, index) => (
            <div key={index} className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) => {
                      const newLanguages = [...languages];
                      newLanguages[index].language = e.target.value;
                      setLanguages(newLanguages);
                    }}
                    disabled={!isEditing}
                    placeholder="e.g., English"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proficiency
                  </label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => {
                      const newLanguages = [...languages];
                      newLanguages[index].proficiency = e.target.value;
                      setLanguages(newLanguages);
                    }}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Select level</option>
                    <option value="native">Native</option>
                    <option value="fluent">Fluent</option>
                    <option value="conversational">Conversational</option>
                    <option value="basic">Basic</option>
                  </select>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => removeLanguage(index)}
                  className="mt-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {languages.length === 0 && (
            <p className="text-sm text-gray-500">No languages added yet</p>
          )}
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
          {isEditing && (
            <Button onClick={addEducation} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-medium text-gray-900">Education {index + 1}</h3>
                {isEditing && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].institution = e.target.value;
                      setEducation(newEducation);
                    }}
                    disabled={!isEditing}
                    placeholder="University name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].degree = e.target.value;
                        setEducation(newEducation);
                      }}
                      disabled={!isEditing}
                      placeholder="e.g., Bachelor's"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].field = e.target.value;
                        setEducation(newEducation);
                      }}
                      disabled={!isEditing}
                      placeholder="e.g., Computer Science"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].startDate = e.target.value;
                        setEducation(newEducation);
                      }}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].endDate = e.target.value;
                        setEducation(newEducation);
                      }}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-sm text-gray-500">No education added yet</p>
          )}
        </div>
      </Card>

      {/* Work Experience (Freelancers only) */}
      {user?.role === 'freelancer' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
            {isEditing && (
              <Button onClick={addExperience} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Experience {index + 1}</h3>
                  {isEditing && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExperience = [...experience];
                          newExperience[index].company = e.target.value;
                          setExperience(newExperience);
                        }}
                        disabled={!isEditing}
                        placeholder="Company name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const newExperience = [...experience];
                          newExperience[index].position = e.target.value;
                          setExperience(newExperience);
                        }}
                        disabled={!isEditing}
                        placeholder="Your role"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => {
                          const newExperience = [...experience];
                          newExperience[index].startDate = e.target.value;
                          setExperience(newExperience);
                        }}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => {
                          const newExperience = [...experience];
                          newExperience[index].endDate = e.target.value;
                          setExperience(newExperience);
                        }}
                        disabled={!isEditing}
                        placeholder="Present"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].description = e.target.value;
                        setExperience(newExperience);
                      }}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Describe your responsibilities and achievements"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            ))}
            {experience.length === 0 && (
              <p className="text-sm text-gray-500">No work experience added yet</p>
            )}
          </div>
        </Card>
      )}

      {/* Portfolio (Freelancers only) */}
      {user?.role === 'freelancer' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
            {isEditing && (
              <Button onClick={addPortfolio} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {portfolio.map((project, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Project {index + 1}</h3>
                  {isEditing && (
                    <button
                      onClick={() => removePortfolio(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => {
                        const newPortfolio = [...portfolio];
                        newPortfolio[index].title = e.target.value;
                        setPortfolio(newPortfolio);
                      }}
                      disabled={!isEditing}
                      placeholder="Project name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) => {
                        const newPortfolio = [...portfolio];
                        newPortfolio[index].description = e.target.value;
                        setPortfolio(newPortfolio);
                      }}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Describe your project"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) => {
                          const newPortfolio = [...portfolio];
                          newPortfolio[index].url = e.target.value;
                          setPortfolio(newPortfolio);
                        }}
                        disabled={!isEditing}
                        placeholder="https://project-url.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={project.imageUrl}
                        onChange={(e) => {
                          const newPortfolio = [...portfolio];
                          newPortfolio[index].imageUrl = e.target.value;
                          setPortfolio(newPortfolio);
                        }}
                        disabled={!isEditing}
                        placeholder="https://image-url.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {portfolio.length === 0 && (
              <p className="text-sm text-gray-500">No portfolio projects added yet</p>
            )}
          </div>
        </Card>
      )}

      {/* Certifications (Freelancers only) */}
      {user?.role === 'freelancer' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
            {isEditing && (
              <Button onClick={addCertification} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Certification {index + 1}</h3>
                  {isEditing && (
                    <button
                      onClick={() => removeCertification(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const newCertifications = [...certifications];
                          newCertifications[index].name = e.target.value;
                          setCertifications(newCertifications);
                        }}
                        disabled={!isEditing}
                        placeholder="e.g., AWS Solutions Architect"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issuing Organization
                      </label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => {
                          const newCertifications = [...certifications];
                          newCertifications[index].issuer = e.target.value;
                          setCertifications(newCertifications);
                        }}
                        disabled={!isEditing}
                        placeholder="e.g., Amazon Web Services"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Date
                      </label>
                      <input
                        type="month"
                        value={cert.issueDate}
                        onChange={(e) => {
                          const newCertifications = [...certifications];
                          newCertifications[index].issueDate = e.target.value;
                          setCertifications(newCertifications);
                        }}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Credential ID
                      </label>
                      <input
                        type="text"
                        value={cert.credentialId}
                        onChange={(e) => {
                          const newCertifications = [...certifications];
                          newCertifications[index].credentialId = e.target.value;
                          setCertifications(newCertifications);
                        }}
                        disabled={!isEditing}
                        placeholder="ID number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Credential URL
                      </label>
                      <input
                        type="url"
                        value={cert.credentialUrl}
                        onChange={(e) => {
                          const newCertifications = [...certifications];
                          newCertifications[index].credentialUrl = e.target.value;
                          setCertifications(newCertifications);
                        }}
                        disabled={!isEditing}
                        placeholder="Verification URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {certifications.length === 0 && (
              <p className="text-sm text-gray-500">No certifications added yet</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
