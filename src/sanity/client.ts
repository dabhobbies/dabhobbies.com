import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 's7p5p11y',
  dataset: 'production',
  apiVersion: '2024-01-01', // use a UTC date in YYYY-MM-DD format
  useCdn: false, // `false` if you want to ensure fresh data
})