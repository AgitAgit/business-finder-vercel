import React from 'react'
import axios from 'axios';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import { getBusinesses } from '@/utils/fetching';

function HomePage() {
  
  const { isLoading, error, data } = useQuery({
    queryKey: ['businessesData'],
    queryFn: getBusinesses
  });
  if(!isLoading && data) console.log("home page says:", data);
  return (
    <div>
      homePage
      <br></br>
      {!isLoading && data && 'data has arrived'}
    </div>
  )
}

export default HomePage