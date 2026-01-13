
import React, { useState } from 'react';
import { OtpPurpose, OtpChannel } from '../types';
import { otpService } from '../services/otpService';
import { PURPOSE_LABELS } from '../constants';

interface DemoClientProps {
  onAction: () => void;
}

const DemoClient: React.FC<DemoClientProps> = ({ onAction }) => {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [identifier, setIdentifier] = useState('');
  const [purpose, setPurpose] = useState<OtpPurpose>(OtpPurpose.REGISTRATION);
  const [channel, setChannel] = useState<OtpChannel>(OtpChannel.EMAIL);
  const [otp, setOtp] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRequest = async () => {
    if (!identifier) {
      setError("Please enter an identifier.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await otpService.requestOtp(identifier, purpose, channel);
      setTokenId(result.tokenId);
      setDebugOtp(result.debugOtp);
      setStep('verify');
      onAction();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const ok = await otpService.verifyOtp(tokenId, otp);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setStep('request');
          setOtp('');
          setTokenId('');
          setDebugOtp('');
        }, 3000);
      } else {
        setError("Invalid OTP code. Please try again.");
      }
      onAction();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Verified Successfully!</h3>
        <p className="text-sm text-slate-500 mt-2">The identity has been confirmed and the process is complete.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {step === 'request' ? (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Purpose</label>
            <select 
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as OtpPurpose)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {Object.entries(PURPOSE_LABELS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email or Phone</label>
            <input 
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            {[OtpChannel.EMAIL, OtpChannel.SMS, OtpChannel.WHATSAPP].map(ch => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  channel === ch 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          <button
            onClick={handleRequest}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Get Started"}
          </button>
        </>
      ) : (
        <div className="animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-4">
             <button onClick={() => setStep('request')} className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
               Back
             </button>
             <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 font-mono">
               Demo-Only Key: {debugOtp}
             </span>
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-1">Verify your {channel}</h3>
          <p className="text-xs text-slate-500 mb-6">Enter the 6-digit code we just sent to <span className="font-semibold text-slate-700">{identifier}</span></p>
          
          <div className="flex gap-2 mb-6">
            <input 
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full bg-white border-2 border-slate-100 rounded-xl p-4 text-center text-3xl font-bold tracking-[0.5em] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-200"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Validating...' : 'Confirm Verification'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">Didn't receive the code?</p>
            <button 
              onClick={handleRequest}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1"
            >
              Resend Code
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium mt-4 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default DemoClient;
