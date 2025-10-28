// The Sanity Studio configuration
// ...
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Dab Hobbies',

  projectId: 'ko6ixh1i',
  dataset: 'production',

  plugins: [structureTool({default: true}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
