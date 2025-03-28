import { useCallback } from "react";
import { useAtom } from "jotai";
import { appConfigAtom } from "@/stores";
import { getConfig, updateConfig } from "@/services/config";
import { useHostname } from "@/hooks/global/use-hostname";
import { env } from "@/env";

export const useConfig = () => {
  const [appConfig] = useAtom(appConfigAtom);
  const dynamicHostname = useHostname();
  const hostname = env.NEXT_PUBLIC_DEV_HOST_NAME || dynamicHostname;
  // const hostname = "4a4n-videosum";

  const fetchConfig = useCallback(async () => {
    if (!hostname || !appConfig?.apiKey) {
      throw new Error("Missing required parameters: hostname or apiKey");
    }

    return getConfig(hostname, appConfig.apiKey);
  }, [hostname, appConfig?.apiKey]);

  const updateConfigValues = useCallback(
    async (values: Record<string, any>, currentVersion: string) => {
      if (!hostname || !appConfig?.apiKey) {
        throw new Error("Missing required parameters: hostname or apiKey");
      }

      return updateConfig(hostname, appConfig.apiKey, values, currentVersion);
    },
    [hostname, appConfig?.apiKey]
  );

  return {
    fetchConfig,
    updateConfigValues,
    isReady: Boolean(hostname && appConfig?.apiKey),
  };
};
