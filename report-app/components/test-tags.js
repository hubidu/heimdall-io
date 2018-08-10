const createTag = (tag, i) => {
  if (tag === '@failing') {
    return (
      <small key={i} className="tag is-warning has-text-white">
        {tag}
      </small>
    )
  }

  return (
    <small key={i} className="tag is-light has-text-link">
      {tag}
    </small>
  )
}


export default ({tags}) =>
  <div className="TestTitle-tags">
  {
      tags && tags.length > 0 && tags.map((tag, i) => createTag(tag, i))
  }
  </div>
