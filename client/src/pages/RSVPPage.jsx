import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { rsvpService } from '../services/api';

export const RSVPPage = () => {
  const { currentTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendance: 'yes',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await rsvpService.submitRSVP({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        attendance: formData.attendance === 'yes',
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        attendance: 'yes',
      });
      setErrors({});

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      if (error.message) {
        setErrorMessage(error.message);
      } else if (error.errors) {
        const newErrs = {};
        error.errors.forEach((err) => {
          newErrs[err.path] = err.msg;
        });
        setErrors(newErrs);
      } else {
        setErrorMessage('Failed to submit RSVP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen py-8 xs:py-12 sm:py-16 md:py-20 px-3 xs:px-4"
      style={{ backgroundColor: currentTheme.bgColor }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-8 xs:mb-10 sm:mb-12">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-3 xs:mb-4" style={{ color: currentTheme.accentColor }}>
            RSVP
          </h1>
          <p className="text-sm xs:text-base sm:text-lg" style={{ color: currentTheme.textColor }}>
            Please let us know if you can join us on our special day
          </p>
        </motion.div>

        {success && (
          <motion.div
            variants={itemVariants}
            className="mb-4 xs:mb-6 p-3 xs:p-4 rounded-lg text-center text-sm xs:text-base"
            style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
            }}
            exit={{ opacity: 0 }}
          >
            ✨ Thank you! Your RSVP has been received. We look forward to seeing you! ✨
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            variants={itemVariants}
            className="mb-4 xs:mb-6 p-3 xs:p-4 rounded-lg text-center text-sm xs:text-base"
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
            }}
          >
            {errorMessage}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="p-4 xs:p-6 sm:p-8 rounded-lg space-y-4 xs:space-y-5 sm:space-y-6"
          style={{
            backgroundColor: `${currentTheme.primaryColor}33`,
            border: `2px solid ${currentTheme.accentColor}`,
          }}
          variants={containerVariants}
        >
          {/* Name Field */}
          <motion.div variants={itemVariants}>
            <label className="block text-xs xs:text-sm font-semibold mb-2" style={{ color: currentTheme.textColor }}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg border text-sm xs:text-base"
              style={{
                borderColor: errors.name ? '#dc3545' : currentTheme.accentColor,
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.textColor,
              }}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-xs xs:text-sm mt-1">{errors.name}</p>}
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label className="block text-xs xs:text-sm font-semibold mb-2" style={{ color: currentTheme.textColor }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg border text-sm xs:text-base"
              style={{
                borderColor: errors.email ? '#dc3545' : currentTheme.accentColor,
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.textColor,
              }}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs xs:text-sm mt-1">{errors.email}</p>}
          </motion.div>

          {/* Phone Field */}
          <motion.div variants={itemVariants}>
            <label className="block text-xs xs:text-sm font-semibold mb-2" style={{ color: currentTheme.textColor }}>
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg border text-sm xs:text-base"
              style={{
                borderColor: errors.phone ? '#dc3545' : currentTheme.accentColor,
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.textColor,
              }}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-xs xs:text-sm mt-1">{errors.phone}</p>}
          </motion.div>

          {/* Attendance Selection */}
          <motion.div variants={itemVariants}>
            <label className="block text-xs xs:text-sm font-semibold mb-3 xs:mb-4" style={{ color: currentTheme.textColor }}>
              Will you be attending? *
            </label>
            <div className="space-y-2 xs:space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="yes"
                  name="attendance"
                  value="yes"
                  checked={formData.attendance === 'yes'}
                  onChange={handleChange}
                  className="w-4 h-4 xs:w-5 xs:h-5"
                  style={{ accentColor: currentTheme.accentColor }}
                />
                <label htmlFor="yes" className="ml-2 xs:ml-3 text-sm xs:text-base" style={{ color: currentTheme.textColor }}>
                  Yes, I will attend! 🎉
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no"
                  name="attendance"
                  value="no"
                  checked={formData.attendance === 'no'}
                  onChange={handleChange}
                  className="w-4 h-4 xs:w-5 xs:h-5"
                  style={{ accentColor: currentTheme.accentColor }}
                />
                <label htmlFor="no" className="ml-2 xs:ml-3 text-sm xs:text-base" style={{ color: currentTheme.textColor }}>
                  Sorry, I cannot attend 😢
                </label>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 xs:py-4 rounded-lg font-semibold text-base xs:text-lg transition-all"
            style={{
              backgroundColor: currentTheme.accentColor,
              color: currentTheme.primaryColor,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            variants={itemVariants}
          >
            {loading ? 'Submitting...' : 'Submit RSVP'}
          </motion.button>

          <p className="text-sm text-center" style={{ color: currentTheme.textColor }}>
            * Required fields
          </p>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default RSVPPage;
