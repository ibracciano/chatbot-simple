/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import type { OrderDetails } from "../types/chatbot";

interface PostState {
  data: OrderDetails | null;
  loading: boolean;
  error: string | null;
}

export function PostDetails(url: string) {
  const [state, setState] = useState<PostState>({
    data: null,
    loading: false,
    error: null,
  });

  const postData = useCallback(
    async (body: any) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: (err as Error).message,
        });
      }
    },
    [url]
  );

  return { ...state, postData };
}
