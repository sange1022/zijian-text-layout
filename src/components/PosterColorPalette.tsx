import { useId, useState } from 'react'
import { POSTER_COLOR_CATEGORIES } from '../data/posterColors'

type PosterColorPaletteProps = {
  onSelect: (color: string) => void
}

export function PosterColorPalette({ onSelect }: PosterColorPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState(POSTER_COLOR_CATEGORIES[0].id)
  const panelId = useId()
  const activeCategory = POSTER_COLOR_CATEGORIES.find(({ id }) => id === activeId) ?? POSTER_COLOR_CATEGORIES[0]

  return (
    <div className="poster-palette">
      <button
        type="button"
        className="palette-toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>海报常用色</span>
        <svg aria-hidden="true" viewBox="0 0 16 16">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </button>
      {isOpen ? (
        <div className="palette-panel" id={panelId}>
          <div className="palette-tabs" role="tablist" aria-label="颜色分类">
            {POSTER_COLOR_CATEGORIES.map((category) => (
              <button
                type="button"
                role="tab"
                aria-selected={category.id === activeCategory.id}
                key={category.id}
                onClick={() => setActiveId(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="palette-swatches">
            {activeCategory.colors.map((color) => (
              <button
                type="button"
                className="palette-swatch"
                aria-label={`选择颜色 ${color}`}
                title={color}
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => onSelect(color)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
