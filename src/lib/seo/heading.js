export function validateHeadingStructure(html) {
  const errors = []
  const headingRegex = /<h([1-6])[^>]*>/gi
  const headings = []
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const startPos = match.index
    const lineNum = (html.substring(0, startPos).match(/\n/g) || []).length + 1
    headings.push({ level, lineNum, tag: `h${level}` })
  }

  if (headings.length === 0) {
    return { valid: false, errors: [{ message: 'No heading tags found in HTML', line: 1 }] }
  }

  const h1Count = headings.filter(h => h.level === 1).length
  if (h1Count === 0) {
    errors.push({ message: 'Missing H1 tag — exactly one H1 is required', line: 1 })
  } else if (h1Count > 1) {
    headings.filter(h => h.level === 1).forEach(h => {
      errors.push({ message: `Multiple H1 tags found — exactly one allowed`, line: h.lineNum })
    })
  }

  let maxLevel = 0
  for (const h of headings) {
    if (h.level > maxLevel + 1) {
      errors.push({
        message: `Heading level skipped: ${h.tag} found after h${maxLevel} — no heading level should be skipped`,
        line: h.lineNum,
      })
    }
    maxLevel = Math.max(maxLevel, h.level)
  }

  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) {
      errors.push({
        message: `Heading level jump: ${headings[i].tag} follows ${headings[i - 1].tag} without intermediate level`,
        line: headings[i].lineNum,
      })
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validatePageBeforePublish(pageData, html) {
  const result = validateHeadingStructure(html)

  if (pageData?.type === 'scholarship' || pageData?.type === 'university') {
    const content = pageData?.translations
    if (!content || Object.keys(content).length === 0) {
      result.errors.push({ message: 'Page has no translations — at least one language required' })
    }
  }

  result.valid = result.errors.length === 0
  return result
}
