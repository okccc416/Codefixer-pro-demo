"use client";

import { useState, useEffect } from "react";
import { useIDEStore } from "@/store/useIDEStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SettingsDialog() {
  const { isSettingsOpen, setSettingsOpen, apiKey, setApiKey, apiProvider, setApiProvider } =
    useIDEStore();

  const [localApiKey, setLocalApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"openai" | "anthropic">("openai");

  useEffect(() => {
    if (isSettingsOpen) {
      setLocalApiKey(apiKey);
      setSelectedProvider(apiProvider);
    }
  }, [isSettingsOpen, apiKey, apiProvider]);

  const handleSave = () => {
    setApiKey(localApiKey);
    setApiProvider(selectedProvider);
    setSettingsOpen(false);
  };

  const handleCancel = () => {
    setLocalApiKey(apiKey);
    setSelectedProvider(apiProvider);
    setSettingsOpen(false);
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "••••••••";
    return key.substring(0, 7) + "•".repeat(Math.min(key.length - 7, 20));
  };

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="sm:max-w-[500px] bg-[#18181b] border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <Key size={20} className="text-blue-500" />
            Settings - API Configuration
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure your API key to enable AI-powered features like code execution and fixes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* API Provider Selection */}
          <div className="space-y-3">
            <Label htmlFor="provider" className="text-zinc-200">
              API Provider
            </Label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProvider("openai")}
                className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                  selectedProvider === "openai"
                    ? "bg-blue-600/20 border-blue-600 text-blue-400"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {selectedProvider === "openai" && <CheckCircle2 size={16} />}
                  <span className="font-medium">OpenAI</span>
                </div>
                <div className="text-xs mt-1 opacity-70">GPT-3.5, GPT-4</div>
              </button>
              <button
                onClick={() => setSelectedProvider("anthropic")}
                className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                  selectedProvider === "anthropic"
                    ? "bg-purple-600/20 border-purple-600 text-purple-400"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {selectedProvider === "anthropic" && <CheckCircle2 size={16} />}
                  <span className="font-medium">Anthropic</span>
                </div>
                <div className="text-xs mt-1 opacity-70">Claude 3</div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <Label htmlFor="apiKey" className="text-zinc-200">
              {selectedProvider === "openai" ? "OpenAI" : "Anthropic"} API Key
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder={
                  selectedProvider === "openai"
                    ? "sk-..."
                    : "sk-ant-..."
                }
                className="pr-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-400 mb-2">
              🔒 Bring Your Own Key (BYOK)
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your API key is encrypted and stored only in your browser's local storage. 
              When you make requests, the key is sent directly to {selectedProvider === "openai" ? "OpenAI" : "Anthropic"}'s 
              servers via secure headers.
            </p>
          </div>

          {/* Current Status */}
          {apiKey && (
            <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Current Key:</span>
                <span className="text-xs font-mono text-zinc-400">
                  {maskApiKey(apiKey)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!localApiKey.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
