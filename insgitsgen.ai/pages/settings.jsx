import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Bell, 
  CheckCircle2, 
  Settings as SettingsIcon,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Database
} from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    weekly_digest: true,
    digest_day: "monday",
    notification_preferences: {
      anomaly_alerts: true,
      forecast_updates: true,
      data_sync_notifications: false
    }
  });
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    base44.auth.me().then(userData => {
      setUser(userData);
      if (userData.weekly_digest !== undefined) {
        setPreferences({
          weekly_digest: userData.weekly_digest ?? true,
          digest_day: userData.digest_day ?? "monday",
          notification_preferences: userData.notification_preferences ?? {
            anomaly_alerts: true,
            forecast_updates: true,
            data_sync_notifications: false
          }
        });
      }
    });
  }, []);

  const updatePreferencesMutation = useMutation({
    mutationFn: async (prefs) => {
      await base44.auth.updateMe(prefs);
    },
    onSuccess: () => {
      setSaveMessage({ type: "success", text: "Preferences saved successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: () => {
      setSaveMessage({ type: "error", text: "Failed to save preferences. Please try again." });
    }
  });

  const handleSave = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="text-lg text-slate-600">
            Manage your notification preferences and email digests
          </p>
        </motion.div>

        {saveMessage && (
          <Alert className={`mb-6 ${saveMessage.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <CheckCircle2 className={`h-4 w-4 ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
            <AlertDescription className={saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {saveMessage.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Weekly Digest Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-indigo-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-indigo-600" />
                  Weekly AI Digest
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                  <div>
                    <Label htmlFor="weekly-digest" className="text-base font-semibold">
                      Enable Weekly Digest
                    </Label>
                    <p className="text-sm text-slate-600 mt-1">
                      Receive a comprehensive weekly summary of all your insights, predictions, and recommendations
                    </p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={preferences.weekly_digest}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, weekly_digest: checked })
                    }
                  />
                </div>

                {preferences.weekly_digest && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="digest-day" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Delivery Day
                      </Label>
                      <Select
                        value={preferences.digest_day}
                        onValueChange={(value) => 
                          setPreferences({ ...preferences, digest_day: value })
                        }
                      >
                        <SelectTrigger id="digest-day">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday Morning</SelectItem>
                          <SelectItem value="tuesday">Tuesday Morning</SelectItem>
                          <SelectItem value="wednesday">Wednesday Morning</SelectItem>
                          <SelectItem value="thursday">Thursday Morning</SelectItem>
                          <SelectItem value="friday">Friday Morning</SelectItem>
                          <SelectItem value="saturday">Saturday Morning</SelectItem>
                          <SelectItem value="sunday">Sunday Morning</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-slate-500">
                        Your digest will be sent every {preferences.digest_day} at 8:00 AM
                      </p>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        What's Included?
                      </h4>
                      <ul className="space-y-1 text-sm text-indigo-800">
                        <li>📊 Summary of all analyses from the past week</li>
                        <li>🔮 Key predictions and forecasts</li>
                        <li>💡 Top recommendations and action items</li>
                        <li>📈 Sentiment trends and changes</li>
                        <li>⚠️ Important anomalies or alerts</li>
                        <li>🎯 Performance metrics and KPIs</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-6 h-6 text-indigo-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                      <Label className="text-base font-semibold">
                        Anomaly Alerts
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Get notified when AI detects unusual patterns or anomalies in your data
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notification_preferences.anomaly_alerts}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        ...preferences,
                        notification_preferences: {
                          ...preferences.notification_preferences,
                          anomaly_alerts: checked
                        }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <Label className="text-base font-semibold">
                        Forecast Updates
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Receive updates when new predictions are generated or forecasts change significantly
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notification_preferences.forecast_updates}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        ...preferences,
                        notification_preferences: {
                          ...preferences.notification_preferences,
                          forecast_updates: checked
                        }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <Label className="text-base font-semibold">
                        Data Sync Notifications
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Get notified when connected data sources sync successfully or encounter errors
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notification_preferences.data_sync_notifications}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        ...preferences,
                        notification_preferences: {
                          ...preferences.notification_preferences,
                          data_sync_notifications: checked
                        }
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end gap-3"
          >
            <Button
              onClick={handleSave}
              disabled={updatePreferencesMutation.isPending}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-8"
            >
              {updatePreferencesMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Email Digest Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-6 border-2 border-green-200 shadow-sm">
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-xl font-bold text-slate-900">📊 Your Weekly Business Insights</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">📈 This Week's Summary</h4>
                      <p className="text-slate-700">
                        You created <strong>3 new analyses</strong> this week. Overall sentiment improved by <strong>+8%</strong>.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">🔮 Key Predictions</h4>
                      <p className="text-slate-700">
                        Short-term forecast shows <strong>12% growth</strong> in the next quarter (high confidence).
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-900 mb-2">💡 Top Recommendations</h4>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        <li>Focus on improving customer response times</li>
                        <li>Optimize marketing spend in high-performing regions</li>
                        <li>Review supplier contracts for cost optimization</li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                        View Full Dashboard →
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}