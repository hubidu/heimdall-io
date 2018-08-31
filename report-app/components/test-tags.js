import {
  matches, TagFailing, TagFlaky, TagATDD, TagATDDUnmet, TagATDDSuccess, TagStory, TagSmoke, TagShouldFailButSucceeded, TagFixit
} from '../services/tag-processor'

const KnownTags = [
  TagFailing, TagFlaky, TagATDD, TagATDDSuccess, TagATDDUnmet, TagStory, TagSmoke, TagShouldFailButSucceeded, TagFixit
]

const tagStyles = color => {
  switch (color) {
    case 'red': return 'TestTitle-tag tag is-danger has-text-white'
    case 'yellow': return 'TestTitle-tag tag is-warning'
    case 'grey': return 'TestTitle-tag tag is-dark'
    case 'blue': return 'TestTitle-tag tag is-info has-text-white'
    case 'link': return 'TestTitle-tag tag is-light has-text-link'
    default: return 'TestTitle-tag tag is-light'
  }
}

const createTag = (tag, i) => {
  const foundTag = KnownTags.find(t => matches(t, tag))

  if (foundTag) {
    return (
      <small key={i} className={tagStyles(foundTag.color)}>
        {
          foundTag.link ?
            <a href={foundTag.link(tag)} target="blank">
              <strong>
                {foundTag.text ? foundTag.text(tag) : tag}
              </strong>
            </a>
            :
            <span>{tag}</span>
        }
      </small>
    )
  }

  return (
    <small key={i} className={tagStyles('none')}>
      {tag}
    </small>
  )
}


export default ({tags}) =>
  <div className="TestTitle-tags">
  {
      tags && tags.length > 0 && tags.map((tag, i) => createTag(tag, i))
  }
  <style jsx global>{`
  `}</style>
  </div>
