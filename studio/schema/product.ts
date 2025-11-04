
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => [
        Rule.required(),
        Rule.min(10).warning('Product name should be at least 10 characters long.'),
        Rule.max(80).warning('For better SEO, keep the product name under 80 characters.'),
      ],
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Upload one or more product images. The first image will be used as the featured image.',
      validation: (Rule: any) => Rule.required().min(1).error('At least one image is required.'),
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{type: 'productBrand'}],
      validation: (Rule: any) => Rule.required(),
    },
    {
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{type: 'productCategory'}],
        validation: (Rule: any) => Rule.required(),
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
        type: 'text'
    },
    {
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: (Rule: any) => Rule.required().min(0),
    },
    {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        description: 'Optional: An initial rating for the product (e.g., 4.5).',
        validation: (Rule: any) => Rule.min(0).max(5),
    },
    {
        name: 'reviewCount',
        title: 'Review Count',
        type: 'number',
        description: 'Optional: An initial review count for the product.',
        validation: (Rule: any) => Rule.min(0),
    },
    {
        name: 'sizes',
        title: 'Sizes',
        type: 'array',
        of: [{type: 'string'}],
    },
    {
        name: 'colors',
        title: 'Colors',
        type: 'array',
        of: [{type: 'string'}],
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
