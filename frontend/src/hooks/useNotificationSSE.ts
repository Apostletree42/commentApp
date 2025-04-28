import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { notificationService } from "../utils/sse";

const useNotificationSSE = (isAuthenticated: boolean) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (isAuthenticated) {
      notificationService.connect();
      
      const removeListener = notificationService.addListener(() => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      });
      
      return () => {
        removeListener();
        notificationService.disconnect();
      };
    }
  }, [isAuthenticated, queryClient]);
};

export default useNotificationSSE;