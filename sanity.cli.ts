
import {defineCliConfig} from 'sanity/cli'
import 'dotenv/config'


const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {
    projectId: projectId!,
    dataset: dataset!
  }
})
