/**
 * Custom hook for API Key validation
 * Shows toast notification if API key is missing
 */

import { useIDEStore } from "@/store/useIDEStore";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function useApiKeyValidation() {
  const { apiKey, hasApiKey, setSettingsOpen } = useIDEStore();
  const { toast } = useToast();

  /**
   * Validate if API key exists before performing action
   * @returns true if valid, false if missing
   */
  const validateApiKey = (actionName: string = "this action"): boolean => {
    if (!hasApiKey()) {
      toast({
        title: "API Key Required",
        description: `Please configure your API key in Settings to use ${actionName}.`,
        variant: "destructive",
        action: (
          <ToastAction 
            altText="Go to settings to configure API key"
            onClick={() => setSettingsOpen(true)}
          >
            Open Settings
          </ToastAction>
        ),
      });
      return false;
    }
    return true;
  };

  /**
   * Get API key with validation
   * @returns API key or null if not set
   */
  const getApiKey = (actionName?: string): string | null => {
    if (!hasApiKey()) {
      if (actionName) {
        validateApiKey(actionName);
      }
      return null;
    }
    return apiKey;
  };

  /**
   * Execute callback only if API key is valid
   */
  const withApiKey = async <T,>(
    callback: (apiKey: string) => Promise<T>,
    actionName: string = "this action"
  ): Promise<T | null> => {
    if (!validateApiKey(actionName)) {
      return null;
    }
    
    try {
      return await callback(apiKey);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    validateApiKey,
    getApiKey,
    withApiKey,
    hasApiKey: hasApiKey(),
  };
}
