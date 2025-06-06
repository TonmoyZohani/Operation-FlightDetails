export function hasValueAbleAgentUpdateData(obj) {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      // Check if any element in the array has a value
      return obj.some(hasValueAbleAgentUpdateData);
    }
    // Check if any property in the object has a value
    return Object.values(obj).some(hasValueAbleAgentUpdateData);
  }
  // Return true for any non-empty value (truthy values)
  return obj !== null && obj !== undefined && obj !== "";
}
