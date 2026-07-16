const mongoose = require('mongoose');
const dns = require('dns');
let connectionPromise;

// Prefer IPv4 on Windows while preserving the machine's configured DNS resolver.
dns.setDefaultResultOrder('ipv4first');

const getConfiguredDnsServers = () => (process.env.DNS_SERVERS || '')
  .split(',')
  .map(server => server.trim())
  .filter(Boolean);

const isSrvDnsFailure = (error) =>
  process.env.MONGODB_URI?.startsWith('mongodb+srv://') &&
  error?.syscall === 'querySrv' &&
  ['ECONNREFUSED', 'ETIMEOUT', 'ENOTFOUND', 'ESERVFAIL'].includes(error?.code);

const connect = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const configuredDnsServers = getConfiguredDnsServers();

  if (configuredDnsServers.length) {
    dns.setServers(configuredDnsServers);
  }

  connectionPromise = connect().catch(async (error) => {
    // Some Windows/router DNS resolvers reject MongoDB Atlas SRV lookups.
    // Keep the system resolver by default, then retry through public DNS only
    // when that specific lookup fails.
    if (!configuredDnsServers.length && isSrvDnsFailure(error)) {
      const fallbackDnsServers = ['1.1.1.1', '8.8.8.8'];
      console.warn(`Atlas DNS lookup failed (${error.code}). Retrying with ${fallbackDnsServers.join(', ')}...`);
      dns.setServers(fallbackDnsServers);
      return connect();
    }

    throw error;
  }).catch((error) => {
    connectionPromise = undefined;
    throw error;
  });

  return connectionPromise;
};

module.exports = connectDB;
