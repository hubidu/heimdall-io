const mapToUnifiedLogFormat = logs => {
  if (!logs) return [];
  if (logs.length === 0) return [];

  const l = logs[0]
  if (l._type) {
    return logs.map(l => ({
      level: l._type.toUpperCase(),
      message: l._text,
    }))
  }
  return logs
}

export default mapToUnifiedLogFormat
