import React, { useState } from 'react';
import { useLogin } from '../../services/hooks/auth';
import { RiLockPasswordLine, RiMailLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import "../../styles/admin.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const loginMutation = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-aesthetic-bg"></div>
      
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">AHM</div>
          <h2 className="login-title">Botanical Command</h2>
          <p className="login-subtitle">Authenticate to manage the artisanal essence collection.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label>Master Email</label>
            <div className="input-with-icon">
              <RiMailLine className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@ahmfragrance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Secret Key</label>
            <div className="input-with-icon">
              <RiLockPasswordLine className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Validating Essence..." : "Access Vault"}
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} AHM Fragrance Artisans</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
