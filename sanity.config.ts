import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './studio/schema'
import {Boxes} from 'lucide-react'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

const customStructure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Products')
        .icon(Boxes)
        .child(
          S.list()
            .title('Products')
            .items([
              S.documentTypeListItem('product').title('All Products'),
              S.documentTypeListItem('productCategory').title('Product Categories'),
            ])
        ),
      ...S.documentTypeListItems().filter(
        (listItem: any) => !['product', 'productCategory'].includes(listItem.getId())
      ),
    ])


export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Dab Hobbies',

  projectId: 'ko6ixh1i',
  dataset: 'dab-g7xk2p9r1mqd_data',

  plugins: [structureTool({structure: customStructure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  // @ts-ignore
  client: {
    useWebSocket: false,
  },
})
