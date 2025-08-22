import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { Calendar, User, Mail, Phone, School, Code, Award, Download, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PooklamRegistrationApp = () => {
  const [submissions, setSubmissions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    college: Yup.string()
      .min(2, 'College name must be at least 2 characters')
      .required('College name is required'),
    year: Yup.string()
      .required('Academic year is required'),
    department: Yup.string()
      .required('Programming language is required'),
   
  });

  // Form handling with Formik

const formik = useFormik({
  initialValues: {
    fullName: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    department:"",

  },
  validationSchema,
  onSubmit: async (values, { resetForm }) => {
    const newSubmission = {
      ...values,
      submissionDate: new Date().toLocaleString(),
    };

    try {
      const res = await fetch(`${process.env}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubmission),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message); // ✅ success toast
        resetForm();
      } else {
        toast.error("Failed to save registration"); // ❌ failure toast
      }
    } catch (error) {
      console.error("Error saving registration:", error);
      toast.error("Something went wrong!");
    }
  }
});



  // Export to Excel function
  const exportToExcel = () => {
    if (submissions.length === 0) {
      alert('No data to export!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(submissions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Full Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 25 }, // College
      { wch: 10 }, // Year
      { wch: 20 }, // Programming Language
      { wch: 15 }, // Experience
      { wch: 40 }, // Why Participate
      { wch: 20 }  // Submission Date
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `pookalam_registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Import from Excel function
  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setSubmissions(jsonData);
        alert(`Successfully imported ${jsonData.length} records!`);
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/30"></div>
        <div className="relative z-10 px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-6">
             Reels competition
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Join us for an exciting coding competition where creativity meets technology. 
              Design and code beautiful digital Pookalams using your programming skills.
            </p>
            <div className="flex justify-center items-center space-x-4 text-yellow-400">
              <Code size={32} />
              <span className="text-2xl font-semibold">2025 Digital Art Competition</span>
              <Award size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle size={24} />
          <span>Registration successful! Welcome to Code-a-Pookalam!</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
        {/* Registration Form */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">Register Now</h2>
          
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.fullName && formik.errors.fullName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-yellow-500'
                }`}
                placeholder="Enter your full name"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-yellow-500'
                }`}
                placeholder="your.email@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.phone && formik.errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-yellow-500'
                }`}
                placeholder="9876543210"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.phone}</p>
              )}
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <School size={16} className="inline mr-2" />
                College/Institution *
              </label>
              <input
                type="text"
                name="college"
                value={formik.values.college}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.college && formik.errors.college
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-yellow-500'
                }`}
                placeholder="Your college/institution name"
              />
              {formik.touched.college && formik.errors.college && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.college}</p>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Calendar size={16} className="inline mr-2" />
               Department
              </label>
            <input
                type="text"
                name="department"
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.department && formik.errors.department
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-yellow-500'
                }`}
                placeholder="Your department"
              />
              {formik.touched.department && formik.errors.department && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.department}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Academic Year *
              </label>
              <select
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.year && formik.errors.year
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-yellow-500'
                }`}
              >
                <option     >Select Your Option</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
               
              </select>
              {formik.touched.year && formik.errors.year && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.year}</p>
              )}
            </div>

        
       
    

            {/* Submit Button */}
            <button
              type="button"
              onClick={formik.handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Register for Code-a-Pookalam
            </button>
          </div>
        </div>

        {/* Info Panel & Data Management */}
        <div className="space-y-8">
          {/* Competition Info */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 rounded-2xl p-8 border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">Competition Details</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <Calendar className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white">Event Date</h4>
                  <p>September 1-4, 2025</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white">Prizes</h4>
                  <p>Win exciting</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Code className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white">Theme</h4>
                  <p>Create Reels </p>
                </div>
              </div>
            </div>
          </div>

      

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 mb-2">
            © 2025 Code-a-Pookalam. Organized by CODE Association.
          </p>
          <p className="text-gray-500 text-sm">
            Celebrating the fusion of tradition and technology through digital art.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PooklamRegistrationApp;
