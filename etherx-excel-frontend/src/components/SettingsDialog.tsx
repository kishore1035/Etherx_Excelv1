import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import {
  Settings,
  User,
  Bell,
  Lock,
  Database,
  Palette,
  Globe,
  Zap,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { User as UserType } from "../types/spreadsheet";

export interface AppSettings {
  // General
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  showGridLines: boolean;
  showFormulas: boolean;
  defaultZoom: number;
  
  // Notifications
  enableNotifications: boolean;
  emailNotifications: boolean;
  commentNotifications: boolean;
  shareNotifications: boolean;
  
  // Privacy
  shareUsageData: boolean;
  allowTracking: boolean;
  
  // Appearance
  theme: "light" | "dark" | "auto";
  compactMode: boolean;
  fontSize: "small" | "medium" | "large";
  
  // Advanced
  enableBetaFeatures: boolean;
  maxUndoSteps: number;
  cellLimit: number;
}

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  user: UserType;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onUpdateProfile: (profile: Partial<UserType>) => void;
  onClearCache: () => void;
  onDeleteAccount: () => void;
}

export function SettingsDialog({
  open,
  onClose,
  settings,
  user,
  onUpdateSettings,
  onUpdateProfile,
  onClearCache,
  onDeleteAccount,
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [localUser, setLocalUser] = useState(user);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onUpdateProfile(localUser);
    toast.success("Settings saved successfully");
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setLocalUser(user);
    toast.info("Settings reset");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Zap className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Lock className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Database className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Save</CardTitle>
                <CardDescription>
                  Automatically save your work at regular intervals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Auto-Save</Label>
                  <Switch
                    checked={localSettings.autoSave}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, autoSave: checked })
                    }
                  />
                </div>

                {localSettings.autoSave && (
                  <div className="space-y-2">
                    <Label>Save Interval (seconds)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[localSettings.autoSaveInterval]}
                        onValueChange={([value]) =>
                          setLocalSettings({ ...localSettings, autoSaveInterval: value })
                        }
                        min={5}
                        max={300}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {localSettings.autoSaveInterval}s
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display</CardTitle>
                <CardDescription>Customize how your spreadsheet looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Show Grid Lines</Label>
                  <Switch
                    checked={localSettings.showGridLines}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, showGridLines: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Formulas</Label>
                  <Switch
                    checked={localSettings.showFormulas}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, showFormulas: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Compact Mode</Label>
                  <Switch
                    checked={localSettings.compactMode}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, compactMode: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={localSettings.fontSize}
                    onValueChange={(value: "small" | "medium" | "large") =>
                      setLocalSettings({ ...localSettings, fontSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={localSettings.theme}
                    onValueChange={(value: "light" | "dark" | "auto") =>
                      setLocalSettings({ ...localSettings, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Zoom</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[localSettings.defaultZoom]}
                      onValueChange={([value]) =>
                        setLocalSettings({ ...localSettings, defaultZoom: value })
                      }
                      min={50}
                      max={200}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {localSettings.defaultZoom}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={localUser.name}
                    onChange={(e) =>
                      setLocalUser({ ...localUser, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={localUser.email}
                    onChange={(e) =>
                      setLocalUser({ ...localUser, email: e.target.value })
                    }
                  />
                </div>

                {localUser.phone && (
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={localUser.phone}
                      onChange={(e) =>
                        setLocalUser({ ...localUser, phone: e.target.value })
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive in-app notifications
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enableNotifications}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, enableNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified via email
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Comment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone comments on your cells
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.commentNotifications}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, commentNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone shares a spreadsheet with you
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.shareNotifications}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, shareNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Control your data and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Usage Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve EtherX Excel
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.shareUsageData}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, shareUsageData: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      For analytics and improvements
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.allowTracking}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, allowTracking: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your stored data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={onClearCache}
                  className="w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>

                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-medium text-destructive mb-2">
                    Danger Zone
                  </p>
                  <Button
                    variant="destructive"
                    onClick={onDeleteAccount}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>For power users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Beta Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Try new features before everyone else
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enableBetaFeatures}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, enableBetaFeatures: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Undo Steps</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[localSettings.maxUndoSteps]}
                      onValueChange={([value]) =>
                        setLocalSettings({ ...localSettings, maxUndoSteps: value })
                      }
                      min={10}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {localSettings.maxUndoSteps}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cell Limit (thousands)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[localSettings.cellLimit]}
                      onValueChange={([value]) =>
                        setLocalSettings({ ...localSettings, cellLimit: value })
                      }
                      min={10}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {localSettings.cellLimit}k
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-2 mt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}