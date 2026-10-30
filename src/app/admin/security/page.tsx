'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { adminApi } from '@/lib/admin-client';

export default function AdminSecurityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
          setNewUsername(data.user.username || '');
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('कृपया अपना वर्तमान पासवर्ड दर्ज करें।');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते। (Passwords do not match)');
      return;
    }

    setSubmitting(true);

    try {
      const data = await adminApi('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim(),
          newPassword,
        }),
      });

      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }

      setSuccessMsg(data.message || 'पासवर्ड एवं सुरक्षा सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'पासवर्ड अपडेट करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center text-ivory">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl text-ivory">
      {/* Title & Introduction */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-ivory flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-gold" />
          <span>एडमिन सुरक्षा एवं पासवर्ड (Security & Credentials)</span>
        </h1>
        <p className="text-xs text-gray-400">
          यहाँ से आप अपना वर्तमान पासवर्ड बदल सकते हैं, यूज़रनेम अपडेट कर सकते हैं और पोर्टल को लाइव करने हेतु सुरक्षित कर सकते हैं।
        </p>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#151B2B] rounded-2xl border border-gold/25 p-4 flex items-center gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] text-gray-400">वर्तमान यूज़रनेम (Username)</span>
            <span className="text-sm font-bold text-ivory font-mono">{currentUser?.username || 'admin'}</span>
          </div>
        </div>

        <div className="bg-[#151B2B] rounded-2xl border border-gold/25 p-4 flex items-center gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] text-gray-400">पासवर्ड एन्क्रिप्शन (Security)</span>
            <span className="text-sm font-bold text-emerald-400">Bcrypt (Salt 10)</span>
          </div>
        </div>

        <div className="bg-[#151B2B] rounded-2xl border border-gold/25 p-4 flex items-center gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] text-gray-400">अधिकार स्तर (Role)</span>
            <span className="text-sm font-bold text-ivory">{currentUser?.role || 'SUPER_ADMIN'}</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-5 shadow-xl">
        <div className="border-b border-navy-light pb-3">
          <h2 className="text-base font-serif font-bold text-gold flex items-center gap-2">
            <Lock className="w-4 h-4 text-gold" />
            <span>एडमिन पासवर्ड एवं यूज़रनेम बदलें (Change Password & Username)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            सुरक्षा के लिए पहले अपना वर्तमान पासवर्ड दर्ज करें, फिर नया मजबूत पासवर्ड सेट करें।
          </p>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-gold mb-1.5">
              वर्तमान पासवर्ड (Current Password) *
            </label>
            <div className="relative max-w-lg">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="वर्तमान पासवर्ड दर्ज करें"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold p-1 transition"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              पहचान सत्यापन के लिए वर्तमान पासवर्ड आवश्यक है।
            </span>
          </div>

          {/* New Username (Optional) */}
          <div className="pt-2 border-t border-navy-light/40">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              एडमिन यूज़रनेम (Admin Username)
            </label>
            <div className="relative max-w-lg">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="उदा. admin या singermunna"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold font-mono"
              />
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              आप चाहें तो यूज़रनेम भी बदल सकते हैं (उदा. admin से singermunna)।
            </span>
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-navy-light/40">
            <div>
              <label className="block text-xs font-semibold text-gold mb-1.5">
                नया सुरक्षित पासवर्ड (New Password) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="कम से कम 6 अक्षरों का नया पासवर्ड"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold p-1 transition"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                न्यूनतम 6 अक्षर रखें (अक्षर, अंक व विशेष चिन्हों का मिश्रण सर्वोत्तम है)।
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold mb-1.5">
                नया पासवर्ड पुनः दर्ज करें (Confirm New Password) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="नया पासवर्ड दोबारा लिखें"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold p-1 transition"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <span className="text-[11px] text-red-400 mt-1 block">
                  पासवर्ड मेल नहीं खा रहे हैं!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-navy-light/60 flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gold hover:bg-gold-light text-navy font-serif font-bold text-sm tracking-wide shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>नया पासवर्ड सेव करें (Save Security Settings)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Best Practices & Go-Live Checklist */}
      <div className="bg-[#151B2B] rounded-2xl border border-gold/20 p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-serif font-bold text-gold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-gold" />
          <span>वेबसाइट लाइव करने हेतु सुरक्षा चेकलिस्ट (Go-Live Security Guide)</span>
        </h3>
        <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-ivory">डिफ़ॉल्ट पासवर्ड बदलें:</strong> वेबसाइट लाइव करने से पहले ऊपर दिए गए फॉर्म से अपना नया सुरक्षित पासवर्ड अवश्य सेट कर लें।
          </li>
          <li>
            <strong className="text-ivory">लॉगिन स्क्रीन पूरी तरह सुरक्षित:</strong> लॉगिन स्क्रीन से डिफ़ॉल्ट पासवर्ड हटा दिया गया है और इनपुट्स खाली रखे गए हैं, जिससे कोई भी तीसरा व्यक्ति पासवर्ड नहीं देख सकता।
          </li>
          <li>
            <strong className="text-ivory">ब्रूट-फोर्स सुरक्षा सक्रिय:</strong> गलत पासवर्ड के 5 बार लगातार प्रयास करने पर सुरक्षा हेतु पोर्टल कुछ मिनटों के लिए लॉक हो जाता है।
          </li>
          <li>
            <strong className="text-ivory">ऑडिट लॉग्स रिकॉर्ड:</strong> हर सफल या असफल लॉगिन प्रयास का समय और विवरण <a href="/admin/logs" className="text-gold underline">ऑडिट लॉग्स (Audit Logs)</a> में दर्ज होता है।
          </li>
        </ul>
      </div>
    </div>
  );
}
