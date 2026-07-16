// Order status state machine
const orderStatusTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [], // Terminal state
  cancelled: [] // Terminal state
};

// Check if a status transition is valid
const isValidStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return true; // Same status is allowed
  const allowedTransitions = orderStatusTransitions[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

// Get allowed next statuses for a given current status
const getAllowedNextStatuses = (currentStatus) => {
  return orderStatusTransitions[currentStatus] || [];
};

// Check if status is terminal (cannot be changed)
const isTerminalStatus = (status) => {
  return orderStatusTransitions[status] && orderStatusTransitions[status].length === 0;
};

module.exports = {
  orderStatusTransitions,
  isValidStatusTransition,
  getAllowedNextStatuses,
  isTerminalStatus
};
