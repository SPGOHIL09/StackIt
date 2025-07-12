import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateStep1 = () => {
    if (!form.firstName || !form.lastName || !form.username) {
      setError("Please fill in all required fields");
      return false;
    }
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError("");

    try {
      const submitData = { ...form };
      delete submitData.confirmPassword;
      await API.post("/users/register", submitData);
      navigate("/login", { 
        state: { 
          message: "Account created successfully! Please log in." 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" };
    
    let strength = 0;
    const checks = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength <= 2) return { strength, text: "Weak", color: "#dc3545" };
    if (strength <= 3) return { strength, text: "Fair", color: "#ffc107" };
    if (strength <= 4) return { strength, text: "Good", color: "#28a745" };
    return { strength, text: "Strong", color: "#28a745" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <div className="logo-section">
              <div className="logo-icon">
                <i className="fas fa-stack-overflow"></i>
              </div>
              <h1 className="logo-text">StackIt</h1>
            </div>
            <div className="m-2" style={{ marginTop: 10 }}>
              <h2 className="register-title mt-2">Create Your Account</h2>
            <p className="register-subtitle">Join thousands of developers worldwide</p>
            </div>
            
            
            {/* Progress Steps */}
            <div className="progress-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Personal Info</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Account Setup</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="form-step">
                <h3 className="step-title">Tell us about yourself</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First Name *
                    </label>
                    <div className="input-wrapper">
                      <i className="fas fa-user input-icon"></i>
                      <input
                        id="firstName"
                        className="form-input"
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name *
                    </label>
                    <div className="input-wrapper">
                      <i className="fas fa-user input-icon"></i>
                      <input
                        id="lastName"
                        className="form-input"
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username *
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-at input-icon"></i>
                    <input
                      id="username"
                      className="form-input"
                      type="text"
                      name="username"
                      placeholder="Choose a unique username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-hint">
                    This will be your public display name
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dob" className="form-label">
                    Date of Birth
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-calendar input-icon"></i>
                    <input
                      id="dob"
                      className="form-input"
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="next-btn"
                  onClick={nextStep}
                >
                  Continue
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h3 className="step-title">Setup your account</h3>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      id="email"
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-lock input-icon"></i>
                    <input
                      id="password"
                      className="form-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {form.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill" 
                          style={{ 
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                            backgroundColor: passwordStrength.color
                          }}
                        ></div>
                      </div>
                      <div className="strength-text" style={{ color: passwordStrength.color }}>
                        {passwordStrength.text}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-lock input-icon"></i>
                    <input
                      id="confirmPassword"
                      className="form-input"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <div className="form-hint error">
                      Passwords do not match
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={prevStep}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-check"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="register-illustration">
          <div className="illustration-content">
            <h3>Start Your Journey</h3>
            <p>Join our community of passionate developers</p>
            <div className="benefits">
              <div className="benefit">
                <i className="fas fa-graduation-cap"></i>
                <div>
                  <h4>Learn & Grow</h4>
                  <p>Expand your knowledge with expert answers</p>
                </div>
              </div>
              <div className="benefit">
                <i className="fas fa-handshake"></i>
                <div>
                  <h4>Help Others</h4>
                  <p>Share your expertise and build reputation</p>
                </div>
              </div>
              <div className="benefit">
                <i className="fas fa-trophy"></i>
                <div>
                  <h4>Achieve More</h4>
                  <p>Unlock badges and recognition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          background: linear-gradient(30deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .register-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .register-card {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-height: 90vh;
          overflow-y: auto;
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(30deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .register-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }

        .register-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0 0 2rem 0;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: linear-gradient(30deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%);
          color: white;
        }

        .step-label {
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 500;
        }

        .step.active .step-label {
          color: #2c3e50;
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: #e9ecef;
          margin: 0 -1rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-step {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1rem;
          text-align: center;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #6c757d;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 2.5rem;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff7e5f;
          background: white;
          box-shadow: 0 0 0 3px rgba(255, 126, 95, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #495057;
        }

        .form-hint {
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }

        .form-hint.error {
          color: #dc3545;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
        }

        .strength-text {
          font-size: 0.8rem;
          font-weight: 500;
          min-width: 50px;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .back-btn {
          flex: 1;
          padding: 1rem 2rem;
          border: 2px solid #e9ecef;
          background: white;
          color: #6c757d;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .back-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .next-btn, .submit-btn {
          background: linear-gradient(30deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .next-btn {
          width: 100%;
        }

        .submit-btn {
          flex: 2;
        }

        .next-btn:hover, .submit-btn:hover:not(:disabled) {
          box-shadow: 0 8px 25px rgba(255, 126, 95, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .register-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .login-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link:hover {
          color: #5a6fd8;
        }

        .register-illustration {
          background: linear-gradient(30deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: white;
        }

        .illustration-content {
          text-align: center;
          max-width: 400px;
        }

        .illustration-content h3 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .illustration-content > p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .benefits {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .benefit {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          text-align: left;
        }

        .benefit i {
          font-size: 2rem;
          opacity: 0.8;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .benefit h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .benefit p {
          font-size: 0.9rem;
          opacity: 0.8;
          margin: 0;
        }

        @media (max-width: 968px) {
          .register-wrapper {
            grid-template-columns: 1fr;
            max-width: 600px;
          }
          
          .register-illustration {
            display: none;
          }
          
          .register-card {
            padding: 2rem;
          }
          
          .register-title {
            font-size: 1.5rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;