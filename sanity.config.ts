import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './studio/schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Dab Hobbies',

  projectId: 'ko6ixh1i',
  dataset: 'dab-g7xk2p9r1mqd_data',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  // @ts-ignore
  client: {
    useWebSocket: false,
  },
})