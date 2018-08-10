import {matches, TagFailing, TagFlaky, TagATDD, TagATDDUnmet, TagStory, TagSmoke, TagShouldFailButSucceeded} from '../services/tag-processor'

const KnownTags = [TagFailing, TagFlaky, TagATDD, TagATDDUnmet, TagStory, TagSmoke, TagShouldFailButSucceeded]

const tagStyles = color => {
  switch (color) {
    case 'red': return 'tag is-danger has-text-white'
    case 'yellow': return 'tag is-warning'
    case 'grey': return 'tag is-dark'
    case 'blue': return 'tag is-info has-text-white'
    case 'link': return 'tag is-light has-text-link'
    default: return 'tag is-light'
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
                {tag}
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
    .tag {
      height: 1.5em;
    }
  `}</style>
  </div>
