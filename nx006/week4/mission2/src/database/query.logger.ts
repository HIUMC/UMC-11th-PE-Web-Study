import type { Logger } from 'typeorm';

// Opt-in SQL diagnostics omit bound parameter values and connection credentials.
export class QueryLogger implements Logger {
  constructor(private readonly enabled: boolean) {}
  logQuery(query: string) {
    if (this.enabled)
      console.log(JSON.stringify({ event: 'ORM_QUERY', sql: query }));
  }
  logQueryError() {
    console.error('ORM query failed');
  }
  logQuerySlow(_time: number, query: string) {
    this.logQuery(query);
  }
  logSchemaBuild() {}
  logMigration() {}
  log() {}
}
