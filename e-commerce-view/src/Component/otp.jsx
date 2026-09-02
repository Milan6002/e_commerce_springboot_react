import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// PrimeReact Imports
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const toast = useRef(null);
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!email) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter your email.' });
      return;
    }
    setLoading(true);
    axios.post(`http://localhost:8081/api/auth/send-otp?email=${email}`)
      .then(() => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'OTP Sent successfully.' });
        setStep(2);
      })
      .catch((err) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to send OTP. Please check email or try again.' });
      })
      .finally(() => setLoading(false));
  };

  const verifyOtp = () => {
    if (!otp) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter OTP.' });
      return;
    }
    setLoading(true);
    axios.post(`http://localhost:8081/api/auth/verify-otp?email=${email}&otp=${otp}`)
      .then(res => {
        if (res.data === "Verified") {
          toast.current.show({ severity: 'success', summary: 'Success', detail: 'OTP Verified.' });
          setStep(3);
        } else {
          toast.current.show({ severity: 'error', summary: 'Error', detail: res.data });
        }
      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Verification failed.' });
      })
      .finally(() => setLoading(false));
  };

  const resetPassword = () => {
    if (!password) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter new password.' });
      return;
    }
    setLoading(true);
    axios.post(`http://localhost:8081/api/auth/reset-password?email=${email}&password=${password}`)
      .then(() => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password Updated Successfully.' });
        setTimeout(() => navigate('/login'), 1500);
      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update password.' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-100 p-4">
      <Toast ref={toast} />
      <Card title="Forgot Password" style={{ width: '100%', maxWidth: '400px' }} className="shadow-4">
        
        {step === 1 && (
          <div className="flex flex-column gap-3">
            <p className="text-gray-600 m-0">Enter your email address to receive an OTP.</p>
            <span className="p-float-label mt-3">
              <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
              <label htmlFor="email">Email</label>
            </span>
            <Button label="Send OTP" icon="pi pi-envelope" onClick={sendOtp} loading={loading} className="w-full mt-2" />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-column gap-3">
            <p className="text-gray-600 m-0">Enter the OTP sent to <b>{email}</b></p>
            <span className="p-float-label mt-3">
              <InputText id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full" />
              <label htmlFor="otp">Enter OTP</label>
            </span>
            <Button label="Verify OTP" icon="pi pi-check" onClick={verifyOtp} loading={loading} className="w-full mt-2" />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-column gap-3">
            <p className="text-gray-600 m-0">Set your new password.</p>
            <span className="p-float-label mt-3">
              <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask className="w-full" inputClassName="w-full" />
              <label htmlFor="password">New Password</label>
            </span>
            <Button label="Reset Password" icon="pi pi-refresh" onClick={resetPassword} loading={loading} className="w-full mt-2 p-button-success" />
          </div>
        )}

      </Card>
    </div>
  );
}

export default ForgotPassword;