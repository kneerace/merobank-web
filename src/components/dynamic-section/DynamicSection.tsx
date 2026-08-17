import { getValue, formatValue } from '../../utils/jsonPath'
import type { DynamicSectionProps } from './types'
import './DynamicSection.css'

function DynamicSection({ config, data }: DynamicSectionProps) {
  const layout = config.data[0]?.layout ?? []
  const { borderless, showShadow } = config.metadata

  return (
    <div className={`dynamic-section
      ${borderless ? 'borderless' : ''}
      ${showShadow ? 'shadow' : ''}`}>
      {layout.map((item) => (
        <div key={item.jsonPath} className={`field-row ${item.type}`}>
          <span className="field-label">{item.header}</span>
          <span className="field-value">
            {formatValue(getValue(data, item.jsonPath), item.primaryValueFormatter)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default DynamicSection