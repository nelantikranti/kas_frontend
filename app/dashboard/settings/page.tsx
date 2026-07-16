"use client";

import { useState, useEffect } from "react";
import { IoSave, IoNotifications, IoColorPalette } from "react-icons/io5";
import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io5";
import { toast } from "@/components/Toast";
import { settingsAPI } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "KAS Elevator",
    email: "info@kas.com",
    phone: "+91 98765 43210",
    address: "123 Business Street, Mumbai, Maharashtra",
    notifications: {
      email: true,
      sms: false,
      whatsapp: true,
    },
  });

  const [fbLeadCreds, setFbLeadCreds] = useState({ accessToken: "", pageId: "" });
  const [fbLoading, setFbLoading] = useState(true);
  const [fbSaving, setFbSaving] = useState(false);

  const [googleAdsWebhook, setGoogleAdsWebhook] = useState({
    webhookUrl: "",
    webhookSecret: "",
  });
  const [googleAdsLoading, setGoogleAdsLoading] = useState(true);
  const [googleAdsSaving, setGoogleAdsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setFbLoading(true);
      try {
        const res = await settingsAPI.getFacebookLeadAds();
        if (!cancelled && res) {
          setFbLeadCreds((c) => ({
            ...c,
            pageId: res.pageId || "",
          }));
        }
      } catch {
        if (!cancelled) {
          setFbLeadCreds((c) => ({ ...c, pageId: "" }));
        }
      } finally {
        if (!cancelled) setFbLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setGoogleAdsLoading(true);
      try {
        const res = await settingsAPI.getGoogleAds();
        if (!cancelled && res) {
          setGoogleAdsWebhook({
            webhookUrl: res.webhookUrl || "",
            webhookSecret: "",
          });
        }
      } catch {
        if (!cancelled) {
          setGoogleAdsWebhook({ webhookUrl: "", webhookSecret: "" });
        }
      } finally {
        if (!cancelled) setGoogleAdsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleSaveFacebookCreds = async () => {
    if (!fbLeadCreds.pageId.trim()) {
      toast.error("Page ID is required.");
      return;
    }
    if (!fbLeadCreds.accessToken.trim()) {
      toast.error("Access Token is required for Facebook Lead Ads. Enter token to save or update.");
      return;
    }
    setFbSaving(true);
    try {
      await settingsAPI.updateFacebookLeadAds({
        accessToken: fbLeadCreds.accessToken.trim(),
        pageId: fbLeadCreds.pageId.trim(),
      });
      toast.success("Facebook Lead Ads credentials saved on the server. Leads will sync automatically; use Sync Facebook on the Leads page if needed.");
      setFbLeadCreds((c) => ({ ...c, accessToken: "" }));
    } catch (e: any) {
      toast.error(e.message || "Failed to save credentials.");
    } finally {
      setFbSaving(false);
    }
  };

  const handleSaveGoogleAdsCreds = async () => {
    const { webhookUrl, webhookSecret } = googleAdsWebhook;
    if (!webhookUrl.trim()) {
      toast.error("Webhook URL is required for Google Ads.");
      return;
    }
    if (!webhookSecret.trim()) {
      toast.error("Webhook secret key is required for Google Ads.");
      return;
    }
    setGoogleAdsSaving(true);
    try {
      await settingsAPI.updateGoogleAds({
        webhookUrl: webhookUrl.trim(),
        webhookSecret: webhookSecret.trim(),
      });
      toast.success("Google Ads webhook settings saved. Configure this URL and secret in your Google Ads lead form.");
      setGoogleAdsWebhook((c) => ({ ...c, webhookSecret: "" }));
    } catch (e: any) {
      toast.error(e.message || "Failed to save credentials.");
    } finally {
      setGoogleAdsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <IoColorPalette className="w-4 h-4 sm:w-5 sm:h-5" />
            Company Information
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <IoNotifications className="w-4 h-4 sm:w-5 sm:h-5" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, sms: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <div>
                <p className="font-medium text-gray-900">WhatsApp Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.whatsapp}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, whatsapp: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Facebook Lead Ads Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <IoLogoFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            Facebook Lead Ads Integration
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Set your Facebook credentials here. Leads from Facebook Lead Ads will sync automatically to the CRM. If sync fails due to a technical error, use <strong>Sync Facebook</strong> on the Leads page.
          </p>
          <div className="space-y-3 sm:space-y-4">
            {fbLoading ? (
              <p className="text-sm text-gray-500">Loading saved settings...</p>
            ) : null}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Token *</label>
              <input
                type="password"
                value={fbLeadCreds.accessToken}
                onChange={(e) => setFbLeadCreds((c) => ({ ...c, accessToken: e.target.value }))}
                placeholder="User or Page token. Needs leads_retrieval; if User token, also pages_show_list (we use Page token for lead forms)."
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Token is stored on the backend only and never shown again after save.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page ID *</label>
              <input
                type="text"
                value={fbLeadCreds.pageId}
                onChange={(e) => setFbLeadCreds((c) => ({ ...c, pageId: e.target.value }))}
                placeholder="e.g. 123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leads are fetched from all leadgen forms on this Facebook Page.</p>
            </div>
            <button
              type="button"
              onClick={handleSaveFacebookCreds}
              disabled={fbSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              <IoSave className="w-4 h-4" />
              {fbSaving ? "Saving..." : "Save Facebook credentials"}
            </button>
          </div>
        </div>

        {/* Google Ads Integration via Webhook */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <IoLogoGoogle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            Google Ads Integration
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Configure a secure webhook URL and secret for Google Ads lead forms. Google Ads will POST lead data directly to your CRM using this webhook; no OAuth or API credentials are stored.
          </p>
          <div className="space-y-3 sm:space-y-4">
            {googleAdsLoading ? (
              <p className="text-sm text-gray-500">Loading saved settings...</p>
            ) : null}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL *</label>
              <input
                type="text"
                value={googleAdsWebhook.webhookUrl}
                onChange={(e) => setGoogleAdsWebhook((c) => ({ ...c, webhookUrl: e.target.value }))}
                placeholder="e.g. https://your-backend-domain/api/leads/webhook/google-ads?lead_key=YOUR_SECRET"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret Key *</label>
              <input
                type="password"
                value={googleAdsWebhook.webhookSecret}
                onChange={(e) => setGoogleAdsWebhook((c) => ({ ...c, webhookSecret: e.target.value }))}
                placeholder="Secret key used as lead_key in Google Ads webhook settings"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This secret is stored on the backend only and should match the <code>lead_key</code> you configure in Google Ads.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveGoogleAdsCreds}
              disabled={googleAdsSaving}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              <IoSave className="w-4 h-4" />
              {googleAdsSaving ? "Saving..." : "Save Google Ads credentials"}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <IoSave className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

