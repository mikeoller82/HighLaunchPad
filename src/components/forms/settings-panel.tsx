"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Settings,
  Palette,
  Shield,
  Bell,
  CreditCard,
  Calendar,
  BarChart3,
  ChevronDown,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  Globe,
  Mail,
  Database,
  Webhook,
  DollarSign,
  Lock,
  Users,
  Clock,
  FileText,
  Smartphone,
} from "lucide-react";
import type {
  FormField,
  FormSettings,
  ValidationRule,
  ConditionalLogic,
} from "@/lib/form-types";
import { Separator } from "../ui/separator";
import { useState } from "react";

interface SettingsPanelProps {
  selectedField: FormField | null;
  onUpdateField: (id: string, newProps: Partial<FormField>) => void;
  onClearSelection: () => void;
  formSettings: FormSettings;
  onUpdateFormSettings: (settings: Partial<FormSettings>) => void;
}

export function SettingsPanel({
  selectedField,
  onUpdateField,
  onClearSelection,
  formSettings,
  onUpdateFormSettings,
}: SettingsPanelProps) {
  const [activeFormTab, setActiveFormTab] = useState("general");

  const addValidationRule = (fieldId: string) => {
    const newRule: ValidationRule = {
      type: "required",
      message: "This field is required",
    };

    const currentRules = selectedField?.validation || [];
    onUpdateField(fieldId, { validation: [...currentRules, newRule] });
  };

  const updateValidationRule = (
    fieldId: string,
    ruleIndex: number,
    updates: Partial<ValidationRule>
  ) => {
    const currentRules = selectedField?.validation || [];
    const updatedRules = currentRules.map((rule, index) =>
      index === ruleIndex ? { ...rule, ...updates } : rule
    );
    onUpdateField(fieldId, { validation: updatedRules });
  };

  const removeValidationRule = (fieldId: string, ruleIndex: number) => {
    const currentRules = selectedField?.validation || [];
    const updatedRules = currentRules.filter((_, index) => index !== ruleIndex);
    onUpdateField(fieldId, { validation: updatedRules });
  };

  const addConditionalLogic = (fieldId: string) => {
    const newLogic: ConditionalLogic = {
      field: "",
      operator: "equals",
      value: "",
      action: "show",
    };

    const currentLogic = selectedField?.conditionalLogic || [];
    onUpdateField(fieldId, { conditionalLogic: [...currentLogic, newLogic] });
  };

  const addOption = (fieldId: string) => {
    const currentOptions = selectedField?.options || [];
    onUpdateField(fieldId, {
      options: [...currentOptions, `Option ${currentOptions.length + 1}`],
    });
  };

  const updateOption = (
    fieldId: string,
    optionIndex: number,
    value: string
  ) => {
    const currentOptions = selectedField?.options || [];
    const updatedOptions = currentOptions.map((option, index) =>
      index === optionIndex ? value : option
    );
    onUpdateField(fieldId, { options: updatedOptions });
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const currentOptions = selectedField?.options || [];
    const updatedOptions = currentOptions.filter(
      (_, index) => index !== optionIndex
    );
    onUpdateField(fieldId, { options: updatedOptions });
  };

  if (!selectedField) {
    return (
      <div className="p-4">
        <Tabs value={activeFormTab} onValueChange={setActiveFormTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="text-xs">
              General
            </TabsTrigger>
            <TabsTrigger value="features" className="text-xs">
              Features
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs">
              Integrations
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)] mt-4">
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Basic Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-name">Form Name</Label>
                    <Input
                      id="form-name"
                      value={formSettings.name}
                      onChange={(e) =>
                        onUpdateFormSettings({ name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-description">Description</Label>
                    <Textarea
                      id="form-description"
                      placeholder="Brief description of your form"
                      value={formSettings.description || ""}
                      onChange={(e) =>
                        onUpdateFormSettings({ description: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-submit-text">Submit Button Text</Label>
                    <Input
                      id="form-submit-text"
                      value={formSettings.submitButtonText}
                      onChange={(e) =>
                        onUpdateFormSettings({
                          submitButtonText: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-success-message">
                      Success Message
                    </Label>
                    <Textarea
                      id="form-success-message"
                      value={formSettings.successMessage}
                      onChange={(e) =>
                        onUpdateFormSettings({ successMessage: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-redirect-url">
                      Redirect URL (Optional)
                    </Label>
                    <Input
                      id="form-redirect-url"
                      placeholder="https://example.com/thank-you"
                      value={formSettings.redirectUrl || ""}
                      onChange={(e) =>
                        onUpdateFormSettings({ redirectUrl: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Theme & Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded border bg-blue-500"></div>
                        <Input value="#3b82f6" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Background</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded border bg-white"></div>
                        <Input value="#ffffff" className="flex-1" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select defaultValue="inter">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="helvetica">Helvetica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Form Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Progress Bar</Label>
                      <p className="text-xs text-muted-foreground">
                        Show completion progress
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.enableProgressBar}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({ enableProgressBar: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Save & Continue</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow users to save drafts
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.enableSaveAndContinue}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({ enableSaveAndContinue: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Save</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically save progress
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.enableAutoSave}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({ enableAutoSave: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Multiple Submissions</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow repeat submissions
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.allowMultipleSubmissions}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({
                          allowMultipleSubmissions: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Login</Label>
                      <p className="text-xs text-muted-foreground">
                        Users must be logged in
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.requireLogin}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({ requireLogin: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security & Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>CAPTCHA Protection</Label>
                      <p className="text-xs text-muted-foreground">
                        Prevent spam submissions
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.security?.enableCaptcha}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({
                          security: {
                            enableCaptcha: checked,
                            enableRateLimit:
                              formSettings.security?.enableRateLimit ?? false,
                            maxSubmissionsPerHour:
                              formSettings.security?.maxSubmissionsPerHour ??
                              10,
                            enableEncryption:
                              formSettings.security?.enableEncryption ?? false,
                            enableAuditLog:
                              formSettings.security?.enableAuditLog ?? false,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rate Limiting</Label>
                      <p className="text-xs text-muted-foreground">
                        Limit submissions per hour
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.security?.enableRateLimit}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({
                          security: {
                            enableCaptcha:
                              formSettings.security?.enableCaptcha ?? false,
                            enableRateLimit: checked,
                            maxSubmissionsPerHour:
                              formSettings.security?.maxSubmissionsPerHour ??
                              10,
                            enableEncryption:
                              formSettings.security?.enableEncryption ?? false,
                            enableAuditLog:
                              formSettings.security?.enableAuditLog ?? false,
                          },
                        })
                      }
                    />
                  </div>
                  {formSettings.security?.enableRateLimit && (
                    <div className="space-y-2">
                      <Label>Max Submissions per Hour</Label>
                      <Input
                        type="number"
                        value={
                          formSettings.security?.maxSubmissionsPerHour || 10
                        }
                        onChange={(e) =>
                          onUpdateFormSettings({
                            security: {
                              enableCaptcha:
                                formSettings.security?.enableCaptcha ?? false,
                              enableRateLimit:
                                formSettings.security?.enableRateLimit ?? false,
                              maxSubmissionsPerHour: parseInt(e.target.value),
                              enableEncryption:
                                formSettings.security?.enableEncryption ??
                                false,
                              enableAuditLog:
                                formSettings.security?.enableAuditLog ?? false,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Payments</Label>
                      <p className="text-xs text-muted-foreground">
                        Accept payments through form
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.enablePayments}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({ enablePayments: checked })
                      }
                    />
                  </div>
                  {formSettings.enablePayments && (
                    <>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select defaultValue="USD">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Fixed Amount</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={formSettings.payments?.amount || ""}
                          onChange={(e) =>
                            onUpdateFormSettings({
                              payments: {
                                enabled:
                                  formSettings.payments?.enabled ?? false,
                                currency:
                                  formSettings.payments?.currency ?? "USD",
                                amount: parseFloat(e.target.value),
                                allowCustomAmount:
                                  formSettings.payments?.allowCustomAmount ??
                                  false,
                                paymentMethods:
                                  formSettings.payments?.paymentMethods ?? [],
                                stripePublicKey:
                                  formSettings.payments?.stripePublicKey,
                              },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Admin Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Email alerts for new submissions
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.notifications?.admin.enabled}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({
                          notifications: {
                            admin: {
                              enabled: checked,
                              emails:
                                formSettings.notifications?.admin?.emails ?? [],
                              template:
                                formSettings.notifications?.admin?.template ??
                                "default",
                            },
                            user: {
                              enabled:
                                formSettings.notifications?.user?.enabled ??
                                false,
                              template:
                                formSettings.notifications?.user?.template ??
                                "default",
                              subject:
                                formSettings.notifications?.user?.subject ??
                                "Form Submission Confirmation",
                            },
                          },
                        })
                      }
                    />
                  </div>
                  {formSettings.notifications?.admin.enabled && (
                    <div className="space-y-2">
                      <Label>Admin Email Addresses</Label>
                      <Textarea
                        placeholder="admin@company.com, manager@company.com"
                        value={
                          formSettings.notifications?.admin.emails?.join(
                            ", "
                          ) || ""
                        }
                        onChange={(e) =>
                          onUpdateFormSettings({
                            notifications: {
                              admin: {
                                enabled:
                                  formSettings.notifications?.admin?.enabled ??
                                  false,
                                emails: e.target.value
                                  .split(",")
                                  .map((email) => email.trim()),
                                template:
                                  formSettings.notifications?.admin?.template ??
                                  "default",
                              },
                              user: {
                                enabled:
                                  formSettings.notifications?.user?.enabled ??
                                  false,
                                template:
                                  formSettings.notifications?.user?.template ??
                                  "default",
                                subject:
                                  formSettings.notifications?.user?.subject ??
                                  "Form Submission Confirmation",
                              },
                            },
                          })
                        }
                        rows={2}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Confirmations</Label>
                      <p className="text-xs text-muted-foreground">
                        Send confirmation emails to users
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.notifications?.user.enabled}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({
                          notifications: {
                            admin: {
                              enabled:
                                formSettings.notifications?.admin?.enabled ??
                                false,
                              emails:
                                formSettings.notifications?.admin?.emails ?? [],
                              template:
                                formSettings.notifications?.admin?.template ??
                                "default",
                            },
                            user: {
                              enabled: checked,
                              template:
                                formSettings.notifications?.user?.template ??
                                "default",
                              subject:
                                formSettings.notifications?.user?.subject ??
                                "Form Submission Confirmation",
                            },
                          },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label>Email Marketing</Label>
                        <p className="text-xs text-muted-foreground">
                          Mailchimp, ConvertKit
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <Label>CRM</Label>
                        <p className="text-xs text-muted-foreground">
                          Salesforce, HubSpot
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Webhook className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label>Webhooks</Label>
                        <p className="text-xs text-muted-foreground">
                          Custom integrations
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Form Analytics</Label>
                      <p className="text-xs text-muted-foreground">
                        Track views and conversions
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.enableAnalytics}
                      onCheckedChange={(checked) =>
                        onUpdateFormSettings({ enableAnalytics: checked })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">
                        Submissions
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator className="my-6" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Select a field to edit its properties
          </p>
          <div className="text-xs text-muted-foreground">
            💡 Tip: Click on any field in the canvas to customize it
          </div>
        </div>
      </div>
    );
  }

  const hasOptions = ["select", "multi-select", "radio", "checkbox"].includes(
    selectedField.type
  );
  const hasNumericProps = ["number", "range"].includes(selectedField.type);
  const hasFileProps = selectedField.type === "file";
  const hasMatrixProps = ["matrix", "likert"].includes(selectedField.type);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">{selectedField.label}</h2>
          <Badge variant="secondary" className="text-xs mt-1">
            {selectedField.type}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Done
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {/* Basic Properties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Basic Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field-label">Label</Label>
                <Input
                  id="field-label"
                  value={selectedField.label}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, { label: e.target.value })
                  }
                />
              </div>

              {selectedField.type !== "section" &&
                selectedField.type !== "divider" && (
                  <div className="space-y-2">
                    <Label htmlFor="field-placeholder">Placeholder</Label>
                    <Input
                      id="field-placeholder"
                      value={selectedField.placeholder || ""}
                      onChange={(e) =>
                        onUpdateField(selectedField.id, {
                          placeholder: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

              <div className="space-y-2">
                <Label htmlFor="field-description">Description</Label>
                <Input
                  id="field-description"
                  placeholder="Brief description or help text"
                  value={selectedField.description || ""}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-help-text">Help Text</Label>
                <Textarea
                  id="field-help-text"
                  placeholder="Additional help text shown below the field"
                  value={selectedField.helpText || ""}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      helpText: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="field-required">Required Field</Label>
                <Switch
                  id="field-required"
                  checked={selectedField.required}
                  onCheckedChange={(checked) =>
                    onUpdateField(selectedField.id, { required: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Field Width</Label>
                <Select
                  value={selectedField.width || "full"}
                  onValueChange={(value) =>
                    onUpdateField(selectedField.id, { width: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="half">Half Width</SelectItem>
                    <SelectItem value="third">One Third</SelectItem>
                    <SelectItem value="quarter">One Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Options for select/radio/checkbox fields */}
          {hasOptions && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Options
                  <Button size="sm" onClick={() => addOption(selectedField.id)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedField.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        updateOption(selectedField.id, index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(selectedField.id, index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!selectedField.options ||
                  selectedField.options.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No options added yet
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Numeric Properties */}
          {hasNumericProps && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Numeric Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Minimum Value</Label>
                    <Input
                      type="number"
                      value={selectedField.min || ""}
                      onChange={(e) =>
                        onUpdateField(selectedField.id, {
                          min: parseFloat(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Value</Label>
                    <Input
                      type="number"
                      value={selectedField.max || ""}
                      onChange={(e) =>
                        onUpdateField(selectedField.id, {
                          max: parseFloat(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Step</Label>
                  <Input
                    type="number"
                    value={selectedField.step || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        step: parseFloat(e.target.value) || undefined,
                      })
                    }
                    placeholder="1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Properties */}
          {hasFileProps && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  File Upload Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Accepted File Types</Label>
                  <Input
                    value={selectedField.accept || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        accept: e.target.value,
                      })
                    }
                    placeholder=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max File Size (MB)</Label>
                  <Input
                    type="number"
                    value={selectedField.maxFileSize || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        maxFileSize: parseFloat(e.target.value) || undefined,
                      })
                    }
                    placeholder="5"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label>Allow Multiple Files</Label>
                  <Switch
                    checked={selectedField.multiple}
                    onCheckedChange={(checked) =>
                      onUpdateField(selectedField.id, { multiple: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Matrix Properties */}
          {hasMatrixProps && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Matrix Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rows (Questions)</Label>
                  <Textarea
                    value={selectedField.matrixRows?.join("\n") || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        matrixRows: e.target.value
                          .split("\n")
                          .filter((row) => row.trim()),
                      })
                    }
                    placeholder="Row 1&#10;Row 2&#10;Row 3"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Columns (Answers)</Label>
                  <Textarea
                    value={selectedField.matrixColumns?.join("\n") || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        matrixColumns: e.target.value
                          .split("\n")
                          .filter((col) => col.trim()),
                      })
                    }
                    placeholder="Column 1&#10;Column 2&#10;Column 3"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Rules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Validation Rules
                <Button
                  size="sm"
                  onClick={() => addValidationRule(selectedField.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedField.validation?.map((rule, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Select
                      value={rule.type}
                      onValueChange={(value) =>
                        updateValidationRule(selectedField.id, index, {
                          type: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="minLength">Min Length</SelectItem>
                        <SelectItem value="maxLength">Max Length</SelectItem>
                        <SelectItem value="pattern">Pattern</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeValidationRule(selectedField.id, index)
                      }
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {rule.type !== "required" &&
                    rule.type !== "email" &&
                    rule.type !== "url" && (
                      <Input
                        placeholder="Value"
                        value={rule.value || ""}
                        onChange={(e) =>
                          updateValidationRule(selectedField.id, index, {
                            value: e.target.value,
                          })
                        }
                      />
                    )}
                  <Input
                    placeholder="Error message"
                    value={rule.message}
                    onChange={(e) =>
                      updateValidationRule(selectedField.id, index, {
                        message: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              {(!selectedField.validation ||
                selectedField.validation.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No validation rules added
                </p>
              )}
            </CardContent>
          </Card>

          {/* Conditional Logic */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Conditional Logic
                <Button
                  size="sm"
                  onClick={() => addConditionalLogic(selectedField.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </CardTitle>
              <CardDescription>
                Show/hide this field based on other field values
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(!selectedField.conditionalLogic ||
                selectedField.conditionalLogic.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No conditional logic rules added
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
