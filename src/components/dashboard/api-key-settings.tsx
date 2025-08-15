"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useApiKey } from "@/context/ApiKeyContext";
import { Eye, EyeOff, ExternalLink, Key, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ApiKeySettings() {
  const { apiKey, setApiKey } = useApiKey();
  const { toast } = useToast();
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter a valid Google AI API key.",
      });
      return;
    }

    // Basic validation - Google AI API keys typically start with 'AIza'
    if (!inputKey.startsWith("AIza")) {
      toast({
        variant: "destructive",
        title: "Invalid API Key Format",
        description:
          'Google AI API keys typically start with "AIza". Please check your key.',
      });
      return;
    }

    setApiKey(inputKey);
    setIsEditing(false);
    toast({
      title: "API Key Saved",
      description: "Your Google AI API key has been saved successfully.",
    });
  };

  const handleRemove = () => {
    setApiKey(null);
    setInputKey("");
    setIsEditing(false);
    toast({
      title: "API Key Removed",
      description: "Your Google AI API key has been removed.",
    });
  };

  const handleCancel = () => {
    setInputKey(apiKey || "");
    setIsEditing(false);
    setShowKey(false);
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return (
      key.substring(0, 4) +
      "•".repeat(key.length - 8) +
      key.substring(key.length - 4)
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Google AI API Key</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Your API key is stored securely in your browser and is used to power
          AI features like content generation, ad copy creation, and funnel
          optimization.
        </p>

        {apiKey && !isEditing ? (
          // Display existing key
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium text-green-800">
                  Current API Key
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm font-mono text-green-700">
                    {showKey ? apiKey : maskKey(apiKey)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKey(!showKey)}
                    className="h-6 w-6 p-0"
                  >
                    {showKey ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Update Key
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Key
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove API Key</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove your Google AI API key?
                      This will disable all AI-powered features until you add a
                      new key.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Remove Key
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          // Input form for new/editing key
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Google AI API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter your Google AI API key (starts with AIza...)"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {apiKey ? "Update Key" : "Save Key"}
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            How to get your Google AI API Key:
          </h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Visit Google AI Studio</li>
            <li>Sign in with your Google account</li>
            <li>Click &ldquo;Get API key&rdquo; in the left sidebar</li>
            <li>Create a new API key or copy an existing one</li>
            <li>Paste it in the field above</li>
          </ol>
          <div className="mt-3">
            <Link
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Get your API key from Google AI Studio
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>
              Your API key is stored locally in your browser and never sent to
              our servers
            </li>
            <li>
              Google AI Studio provides free usage quotas for testing and
              development
            </li>
            <li>Keep your API key secure and don&apos;t share it with others</li>
            <li>You can monitor your usage and billing in Google AI Studio</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
