export interface LayoutItem {
  type: 'leftAligned' | 'rightAligned' | 'fullWidth'
  header: string
  jsonPath: string
  primaryValueFormatter?: 'startCase' | 'currency' | 'date' | 'dateTime'
}

export interface RefDataConfig {
  data: Array<{
    id: string
    layout: LayoutItem[]
  }>
  metadata: {
    borderless: boolean
    showShadow: boolean
  }
}

export interface DynamicSectionProps {
  config: RefDataConfig
  data: Record<string, unknown>
}