import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Helmets', 'Jackets', 'Gloves', 'Boots', 'Pants', 'Suits'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A short description of the product for product cards and previews.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      description: 'A detailed description for the product page, good for SEO.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
        name: 'rating',
        title: 'Rating',
        type: 'number',
        description: 'A number from 1 to 5.',
        validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
        name: 'reviewCount',
        title: 'Review Count',
        type: 'number',
        validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
        name: 'gender',
        title: 'Gender',
        type: 'string',
        options: {
          list: ['Unisex', 'Men', 'Women'],
          layout: 'radio',
        },
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'materials',
        title: 'Materials',
        type: 'array',
        of: [{type: 'string'}],
        description: 'List the primary materials used.',
        options: {
          layout: 'tags',
        },
    }),
    defineField({
        name: 'protection',
        title: 'Protection',
        type: 'array',
        of: [{type: 'string'}],
        description: 'List the protective features (e.g., "CE-approved shoulder armor").',
        options: {
          layout: 'tags',
        },
    }),
    defineField({
        name: 'certification',
        title: 'Certification',
        type: 'string',
        description: 'Safety certifications (e.g., "DOT, ECE 22.05").',
    }),
    defineField({
        name: 'specialFeatures',
        title: 'Special Features',
        type: 'array',
        of: [{type: 'string'}],
        description: 'List any special features (e.g., "Waterproof", "Integrated sun visor").',
        options: {
          layout: 'tags',
        },
    }),
    defineField({
        name: 'weight',
        title: 'Weight (kg)',
        type: 'number',
        description: 'Weight of the product in kilograms.',
        validation: (Rule) => Rule.required().positive(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'brand',
      media: 'image',
    },
  },
})