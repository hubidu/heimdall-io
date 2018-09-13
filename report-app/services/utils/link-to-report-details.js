const linkToReportDetails = (ownerkey, project, id, hashcategory) => {
  const query = { ownerkey, project }
  if (id) {
    query.id = id
  }
  if (hashcategory) {
    query.hashcategory = hashcategory
  }
  return {
    pathname: '/details',
    query
  }
}

module.exports = linkToReportDetails
