import { QueryClient } from '@tanstack/react-query';

let queryClient: QueryClient | null = null;

export default function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient();
  }
  return queryClient;
}
