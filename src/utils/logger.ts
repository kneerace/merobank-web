type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

interface LoggerConfig {
  logLevel: LogLevel
  serviceName: string
  environment: string
}

interface LogEntry {
  level: LogLevel
  service: string
  message: string
  timestamp: string
  data?: unknown
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

class Logger {
  private config: LoggerConfig = {
    logLevel: 'INFO',
    serviceName: 'merobank-web',
    environment: 'local'
  }

  // fetch config from backend on app startup
  async init(apiBase: string): Promise<void> {
    try {
      const res = await fetch(`${apiBase}/api/logger/config`)
      if (res.ok) {
        const remoteConfig = await res.json()
        this.config = { ...this.config, ...remoteConfig }
        this.info('Logger initialized from remote config', this.config)
      }
    } catch {
      // fall back to default config silently
      this.info('Logger using default config (remote config unavailable)')
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.config.logLevel]
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      service: this.config.serviceName,
      message,
      timestamp: new Date().toISOString(),
      ...(data !== undefined && { data })
    }

    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.service}] ${entry.message}`

    switch (level) {
      case 'DEBUG': console.debug(formatted, data ?? '')
        break
      case 'INFO': console.info(formatted, data ?? '')
        break
      case 'WARN': console.warn(formatted, data ?? '')
        break
      case 'ERROR': console.error(formatted, data ?? '')
        break
    }
  }

  debug(message: string, data?: unknown): void { this.log('DEBUG', message, data) }
  info(message: string, data?: unknown): void { this.log('INFO', message, data) }
  warn(message: string, data?: unknown): void { this.log('WARN', message, data) }
  error(message: string, data?: unknown): void { this.log('ERROR', message, data) }
}

export const logger = new Logger()
export default logger