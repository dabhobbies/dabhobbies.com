export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{type: 'productBrand'}]
    },
    {
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{type: 'productCategory'}]
    },
    {
        name: 'description',
        title: 'Description',
        type: 'array',
        of: [{type: 'block'}]
    },
    {
        name: 'longDescription',
        title: 'Long Description',
        type: 'array',
        of: [{type: 'block'}]
    },
    {
        name: 'price',
        title: 'Price',
        type: 'number'
    },
    {
        name: 'rating',
        title: 'Rating',
        type: 'number',
    },
    {
        name: 'reviewCount',
        title: 'Review Count',
        type: 'number'
    },
    {
        name: 'sizes',
        title: 'Sizes',
        type: 'array',
        of: [{type: 'string'}]
    },
    {
        name: 'colors',
        title: 'Colors',
        type: 'array',
        of: [{type: 'string'}]
    },
    {
        name: 'gender',
        title: 'Gender',
        type: 'string',
        options: {
            list: ['Unisex', 'Men', 'Women'],
            layout: 'radio'
        }
    },
    {
        name: 'materials',
        title: 'Materials',
        type: 'array',
        of: [{type: 'string'}]
    },
    {
        name: 'protection',
        title: 'Protection',
        type: 'array',
        of: [{type: 'string'}]
    },
    {
        name: 'certification',
        title: 'Certification',
        type: 'string'
    },
    {
        name: 'specialFeatures',
        title: 'Special Features',
        type: 'array',
        of: [{type: 'string'}]
    },
    {
        name: 'weight',
        title: 'Weight (kg)',
        type: 'number'
    }
  ],
}
