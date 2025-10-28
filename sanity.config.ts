// The Sanity Studio configuration
// ...
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Dab Hobbies',

  projectId: 'ko6ixh1i',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
