import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { generateSchemaByType, generateOrganizationSchema } from '@/lib/seo/jsonld'

export default function JSONLD({ page, lang, slug, pageType, extraSchema }) {
  const schemas = useMemo(() => {
    const result = []
    const orgSchema = generateOrganizationSchema()
    result.push(orgSchema)

    const pageSchema = generateSchemaByType(page, lang, slug, pageType)
    if (pageSchema) result.push(pageSchema)

    if (extraSchema) {
      if (Array.isArray(extraSchema)) result.push(...extraSchema)
      else result.push(extraSchema)
    }

    return result
  }, [page, lang, slug, pageType, extraSchema])

  return (
    <Helmet>
      {schemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
