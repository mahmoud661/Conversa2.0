import { useSettings } from '@/hooks/useSettings';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

const fontSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export function SettingsPage() {
  const settings = useSettings();

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <SettingsSection
        title="Notifications"
        description="Manage how you receive notifications"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Enable notifications</Label>
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(checked) => settings.updateSettings({ notifications: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="sound">Sound effects</Label>
          <Switch
            id="sound"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) => settings.updateSettings({ soundEnabled: checked })}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Customize how the app looks and feels"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) => settings.updateSettings({ theme: value as 'light' | 'dark' | 'system' })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="fontSize">Font size</Label>
          <Select
            value={settings.fontSize}
            onValueChange={(value) => settings.updateSettings({ fontSize: value as 'small' | 'medium' | 'large' })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Language & Translation"
        description="Configure language and translation settings"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="language">Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => settings.updateSettings({ language: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="autoTranslate">Auto-translate messages</Label>
          <Switch
            id="autoTranslate"
            checked={settings.autoTranslate}
            onCheckedChange={(checked) => settings.updateSettings({ autoTranslate: checked })}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Chat Settings"
        description="Configure chat behavior and features"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="smartReplies">Smart replies</Label>
          <Switch
            id="smartReplies"
            checked={settings.smartReplies}
            onCheckedChange={(checked) => settings.updateSettings({ smartReplies: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="readReceipts">Read receipts</Label>
          <Switch
            id="readReceipts"
            checked={settings.readReceipts}
            onCheckedChange={(checked) => settings.updateSettings({ readReceipts: checked })}
          />
        </div>
      </SettingsSection>
    </div>
  );
}