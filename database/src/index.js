import { resolveDatabaseConfig } from './config.js'
import { createD1Repositories } from './d1-repositories.js'
import { hashPassword, verifyPassword } from './password.js'
import { createPrismaRepositories } from './prisma-repositories.js'

export function createRepositories(env = process.env) {
  const database = resolveDatabaseConfig(env)
  if (database.strategy === 'd1') return createD1Repositories(database)
  return createPrismaRepositories(database.connectionString)
}

export { hashPassword, verifyPassword, resolveDatabaseConfig }
